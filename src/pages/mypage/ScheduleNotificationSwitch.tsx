import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
// import { deleteTokenFromBrowser, requestNotificationPermission } from "@/lib/firebase_v1";

/**
 * 스케쥴 알림 구독을 관리하는 토글 스위치 컴포넌트
 */
function ScheduleNotificationSwitch() {
  // 스위치의 ON/OFF 시각적 상태
  const [isEnabled, setIsEnabled] = useState(false);
  // 권한 요청/확인 중 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 2. 컴포넌트가 처음 마운트될 때, 현재 브라우저의 알림 권한 상태를 확인합니다.
  useEffect(() => {
    // 'granted' (허용됨) 상태일 때만 스위치를 켠 상태로 시작합니다.
    if (Notification.permission === "granted") {
      setIsEnabled(true);
    }
    setIsLoading(false); // 권한 확인 완료
  }, []); // 빈 배열: 마운트 시 1회만 실행

  // 3. 스위치를 토글할 때 실행되는 메인 핸들러
  const handleToggle = async (newEnabledState: boolean) => {
    setIsLoading(true);
    console.log('--- A. handleToggle 함수 실행 시작! ---');

    if (newEnabledState) {
      // --- 스위치를 ON으로 켤 때 (알림 구독) ---
      console.log('--- B. (ON) requestNotificationPermission 호출 시도 ---');
      try {
        // 4. Firebase 푸시 알림 권한을 요청하고 토큰을 백엔드에 저장합니다.
        // const fcmToken = await requestNotificationPermission();
        const fcmToken= "";

        if (fcmToken) {
          // 성공: 토큰 발급 및 백엔드 저장 완료
          setIsEnabled(true);
          console.log("알림 구독 완료");
        } else {
          // 실패: 사용자가 권한을 거부했거나 오류 발생
          setIsEnabled(false);
          console.log("알림 권한이 거부되었습니다.");
        }
      } catch (error) {
        console.error("알림 구독 중 오류 발생:", error);
        setIsEnabled(false); // 오류 발생 시 스위치 원상 복구
      }
    } else {
      // --- 스위치를 OFF로 끌 때 (알림 구독 해지) ---
      try {
        // 백엔드 API 대신 브라우저 토큰을 삭제합니다.
        // const isDeleted = await deleteTokenFromBrowser()
        const isDeleted = null;
        if (isDeleted) {
          setIsEnabled(false); // UI 끄기
          console.log('알림 구독 해지 완료 (브라우저 토큰 삭제됨)');
        } else {
          // 토큰 삭제 실패 시, UI를 롤백 (끄지 못함)
          setIsEnabled(true); 
          alert('알림 해지에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('알림 해지 중 오류:', error);
        setIsEnabled(true); // 롤백
      }
      // 5. TODO: 이 부분은 백엔드와 연동이 필요합니다.
      // (예: 백엔드에 '이 fcmToken을 삭제해줘'라고 요청하는 API)
      console.log("알림 구독 해지 로직 실행 (백엔드 API 연동 필요)");
      // (예시: await unregisterTokenFromBackend(currentToken);)
      setIsEnabled(false); // 낙관적 업데이트 (일단 끈 것으로 표시)
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      {isLoading && <span className="text-sm text-gray-500">처리 중...</span>}
      <Switch
        checked={isEnabled}
        onChange={handleToggle}
        disabled={isLoading} // 로딩 중에는 스위치 비활성화
        className={`
          ${isEnabled ? "bg-[#01A862]" : "bg-gray-300"}
          ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"}
          relative inline-flex h-6 w-11 flex-shrink-0
          rounded-full border-2 border-transparent transition-colors
          duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        <span className="sr-only">스케쥴 알림 받기</span>
        {/* 스위치 손잡이 (동그라미) */}
        <span
          aria-hidden="true"
          className={`
            ${isEnabled ? "translate-x-5" : "translate-x-0"}
            pointer-events-none inline-block h-5 w-5
            transform rounded-full bg-white shadow-lg
            ring-0 transition duration-200 ease-in-out
          `}
        />
      </Switch>
    </div>
  );
}

export default ScheduleNotificationSwitch;
