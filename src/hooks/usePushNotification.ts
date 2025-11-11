import { sendFCMToken } from "@/apis/calendar";
import { messaging, vapidKey } from "@/firebase-config";
// import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

// 3단계: 백엔드 API 호출 함수 (axios 등 사용)
async function sendTokenToServer(fcmToken: string) {
  try {
    //
    // ⭐️ 여기가 바로 사용자님이 첨부한 API를 호출하는 부분입니다!
    //
    // const response = await fetch("/v1/member/fcm-token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // TODO: 만약 인증이 필요하다면 'Authorization' 헤더 추가
    //     // 'Authorization': `Bearer ${userToken}`
    //   },
    //   body: JSON.stringify({ fcmToken: fcmToken }),
    // });
    console.log("fcmToken: ", fcmToken);
    const response = await sendFCMToken(JSON.stringify({ fcmToken: fcmToken }));

    if (response) {
      console.log("FCM 토큰을 서버에 성공적으로 전송했습니다.");
    } else {
      console.error("FCM 토큰 서버 전송 실패:", response);
    }
  } catch (error) {
    console.error("FCM 토큰 서버 전송 중 오류:", error);
  }
}

export const usePushNotifications = () => {
  useEffect(() => {
    // 1. 알림 권한 요청
    async function requestPermissionAndGetToken() {
      if (!vapidKey) {
        // ⭐️ vapidKey가 .env에서 로드되지 않았을 경우를 대비한 방어 코드
        console.error(
          "VAPID 키가 로드되지 않았습니다. .env 파일을 확인하세요."
        );
        return;
      }
      // ⭐️ 현재 VAPID 키가 무엇인지 직접 확인
      console.log("Using VAPID Key:", vapidKey);
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("알림 권한이 허용되었습니다.");

          // 2. FCM 토큰 가져오기
          // 이 getToken이 서비스 워커('firebase-messaging-sw.js')를 등록합니다.
          const fcmToken = await getToken(messaging, {
            vapidKey: vapidKey,
          });

          if (fcmToken) {
            console.log("FCM 토큰:", fcmToken);
            // 3. 백엔드 서버로 토큰 전송
            await sendTokenToServer(fcmToken);
          } else {
            console.log(
              "FCM 토큰을 가져올 수 없습니다. (서비스 워커 등록 확인)"
            );
          }
        } else {
          console.log("알림 권한이 거부되었습니다.");
        }
      } catch (error) {
        console.error("알림 권한 요청 중 오류:", error);
      }
    }

    requestPermissionAndGetToken();

    //
    // 🚨 포어그라운드 메시지 핸들러
    // 앱이 활성화된 상태(사용자가 보고 있는 상태)에서 푸시를 받으면 호출됩니다.
    //
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("포어그라운드 메시지 수신:", payload);

      // ⭐️ 중요: 포어그라운드에서는 알림이 자동으로 뜨지 않습니다.
      // 윈도우 알림을 직접 띄우거나, 앱 내 UI (토스트, 스낵바 등)로 처리해야 합니다.
      // 여기서는 예시로 윈도우 알림을 띄웁니다.
      const title = payload.notification?.title || "새 알림";
      const body = payload.notification?.body || "새로운 소식이 있습니다.";

      new Notification(title, {
        body: body,
        icon: "/vite.svg",
      });

      // 예: React-Toastify 같은 라이브러리로 앱 내 알림 표시
      toast.success(`${title}: ${body}`, {
        duration: 2000, // 5초 동안 보이기
      });
    });

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      unsubscribe();
    };
  }, []);
};
