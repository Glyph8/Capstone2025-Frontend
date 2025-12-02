import { useState, useEffect, useCallback } from 'react';
import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { vapidKey } from '@/lib/firebase-config';
import { sendFCMToken } from '@/apis/calendar';
import { toast } from 'react-hot-toast';

// 1. localStorage에서 사용할 키
const FCM_SUBSCRIPTION_KEY = 'fcm_subscribed';

/**
 * 푸시 알림 구독 관리를 위한 커스텀 훅
 * - permission: 브라우저의 실제 권한 상태 ('granted', 'denied', 'default')
 * - isSubscribed: 사용자의 구독 의도 상태 (localStorage 기반)
 */
export const usePushNotifications = () => {
  // 2. 상태 분리
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false); // ⭐️ 스위치 UI가 사용할 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // 3. 컴포넌트 마운트 시, 권한과 '구독 의도'를 localStorage에서 복원
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      if (currentPermission === 'granted') {
        // 권한이 '허용'일 때만 localStorage의 '구독 의도'를 신뢰
        const storedSubscription = localStorage.getItem(FCM_SUBSCRIPTION_KEY);
        // 기본값은 true (권한이 있으면 구독한 것으로 간주)
        setIsSubscribed(storedSubscription === 'false' ? false : true);
      } else {
        // '차단' 또는 '기본' 상태면 무조건 비구독 상태
        setIsSubscribed(false);
        localStorage.setItem(FCM_SUBSCRIPTION_KEY, 'false');
      }

    } else {
      setIsSupported(false);
    }
    setIsLoading(false); // 권한 확인 로딩 완료
  }, []);

  // 4. 알림 권한 요청 (내부 헬퍼 함수)
  const internalRequestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      setError("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return 'denied';
    }
    
    try {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission); // 권한 상태 갱신
      if (newPermission === 'denied') {
        toast.error("알림이 차단되었습니다. 브라우저 설정을 확인해주세요.");
      }
      return newPermission;
    } catch (err) {
      console.error("알림 권한 요청 오류:", err);
      return 'default';
    }
  };

  // 5. 알림 구독 (토큰 발급 및 서버 전송)
const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!localStorage.getItem("access_token")) {
      toast.error("로그인이 필요합니다.");
      setIsLoading(false);
      return; 
    }

    // [수정 포인트 1] state인 permission 대신, 현재 브라우저의 "진짜 상태"를 즉시 조회
    let currentPermission = Notification.permission; 

    // [수정 포인트 2] 디버깅을 위해 현재 상태를 확인 (해결 후 삭제)
    // alert(`현재 권한 상태: ${currentPermission}`); 

    if (currentPermission === 'denied') {
      // 팝업이 안 뜨는 이유가 바로 이것입니다.
      toast.error("알림이 차단되어 있습니다. 브라우저 설정 > 사이트 설정에서 알림을 허용해주세요.");
      setIsLoading(false);
      setPermission('denied'); // UI 업데이트
      return;
    }

    // 권한이 없으면(default) 요청 시도
    if (currentPermission === 'default') {
      // internalRequestPermission 안에서도 Notification.requestPermission()을 호출함
      currentPermission = await internalRequestPermission();
    }

    // 요청 후에도 granted가 아니면 종료
    if (currentPermission !== 'granted') {
      toast.error("알림 권한을 허용해야 구독할 수 있습니다.");
      setIsLoading(false);
      return;
    }
    
    if (!vapidKey) {
      toast.error("VAPID 키가 설정되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    // 3. 토큰 발급 및 서버 전송
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      const fcmToken = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (fcmToken) {
        await sendFCMToken(fcmToken); 
        
        // 4. 구독 성공: 상태 및 localStorage 갱신
        toast.success("알림 구독이 완료되었습니다.");
        setIsSubscribed(true);
        localStorage.setItem(FCM_SUBSCRIPTION_KEY, 'true');
      } else {
        setError("알림 구독에 실패했습니다. (토큰 발급 불가)");
      }
    } catch (err) {
      console.error("알림 구독 중 오류:", err);
      // 401 에러는 전역 인터셉터가 처리할 것이므로, 여기서는 일반 에러 토스트만 표시
      // (무한 리다이렉트 방지)
      if (!(err instanceof Error && err.message.includes("AUTH_EXPIRED"))) {
           toast.error("알림 구독 중 오류가 발생했습니다.");
      }
      setError("알림을 구독하는 중 오류가 발생했습니다.");
      // ⭐️ 구독에 실패했으므로 스위치를 다시 끈다
      setIsSubscribed(false);
      localStorage.setItem(FCM_SUBSCRIPTION_KEY, 'false');
    } finally {
      setIsLoading(false);
    }
  }, [permission]); // 'permission' 상태에 의존

  // 6. 알림 구독 취소 (토큰 삭제)
  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. 브라우저에서 토큰 삭제
      await deleteToken(messaging);
      
      // (백엔드 API 호출은 없음 - 사용자 요청)
      
      // 2. 구독 취소 성공: 상태 및 localStorage 갱신
      toast.success("알림 구독이 취소되었습니다.");
      setIsSubscribed(false);
      localStorage.setItem(FCM_SUBSCRIPTION_KEY, 'false');

    } catch (err) {
      console.error("알림 구독 취소 중 오류:", err);
      toast.error("알림 구독 취소 중 오류가 발생했습니다.");
      // ⭐️ 롤백: 실패 시 스위치를 다시 켠다 (이전 상태로)
      setIsSubscribed(true);
      localStorage.setItem(FCM_SUBSCRIPTION_KEY, 'true');
    } finally {
      setIsLoading(false);
    }
  }, []); // 의존성 없음

  return {
    isSupported,
    permission,
    isSubscribed, // ⭐️ 스위치 UI가 사용할 값
    isLoading,
    error,
    subscribe,    // ⭐️ 스위치가 사용할 함수
    unsubscribe,  // ⭐️ 스위치가 사용할 함수
  };
};