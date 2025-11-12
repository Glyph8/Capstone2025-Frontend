// src/pages/MyPage/ScheduleNotificationSwitch.tsx

import { useEffect } from "react";
import { Switch } from "@headlessui/react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "react-hot-toast";

/**
 * 스케쥴 알림 구독을 관리하는 토글 스위치 컴포넌트
 * (usePushNotifications 훅으로 모든 로직을 위임)
 */
function ScheduleNotificationSwitch() {
  // 1. 훅에서 'isSubscribed'와 'subscribe/unsubscribe' 함수를 받음
  const {
    isSupported,
    permission,
    isSubscribed, // ⭐️ 스위치의 checked 상태
    isLoading,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  useEffect(() => {
    if (error) {
      console.error("Push Notification Hook Error:", error);
    }
  }, [error]);

  // 2. 스위치 토글 핸들러
  const handleToggle = async (newEnabledState: boolean) => {
    if (!isSupported) {
      toast.error("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return;
    }
    
    if (newEnabledState) {
      // --- 스위치를 ON으로 켤 때 (알림 구독) ---
      await subscribe();
    } else {
      // --- 스위치를 OFF로 끌 때 (알림 구독 해지) ---
      await unsubscribe();
    }
  };

  // 브라우저가 지원하지 않으면 스위치 자체를 숨김
  if (!isSupported) {
    return (
      <span className="text-sm text-gray-400">
        이 브라우저는 알림을 지원하지 않습니다.
      </span>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isLoading && <span className="text-sm text-gray-500">처리 중...</span>}
      <Switch
        checked={isSubscribed} // 3. checked 상태를 isSubscribed에 바인딩
        onChange={handleToggle}
        disabled={isLoading || permission === 'denied'} // '차단됨' 상태일 때 비활성화
        className={`
          ${isSubscribed ? "bg-[#01A862]" : "bg-gray-300"}
          ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"}
          ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
          relative inline-flex h-6 w-11 flex-shrink-0
          rounded-full border-2 border-transparent transition-colors
          duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        <span className="sr-only">스케쥴 알림 받기</span>
        <span
          aria-hidden="true"
          className={`
            ${isSubscribed ? "translate-x-5" : "translate-x-0"}
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