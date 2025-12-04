// src/components/AlarmIconButton.tsx

import { setAlramSchedule } from '@/apis/calendar';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Props 타입 정의는 AlarmItemSwitch와 동일합니다.
interface AlarmIconButtonProps {
  scheduleId: number;             // 어떤 스케쥴 아이템인지 식별
  initialIsAlarm: boolean;        // 부모(목록)로부터 받은 초기 알림 상태
}

/**
 * 목록 내 아이템별 알림 설정을 위한 종 모양 아이콘 토글 컴포넌트
 * (옵티미스틱 UI 패턴 적용)
 */
export function AlarmIconButton({
  scheduleId,
  initialIsAlarm,
}: AlarmIconButtonProps) {
  
  // 1. 아이콘의 현재 활성화 상태 (초기값으로 initialIsAlarm 사용)
  const [isActive, setIsActive] = useState(initialIsAlarm);
  // 2. API 통신 중 로딩 상태 (아이콘을 비활성화하거나 스피너 표시용)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 아이콘을 클릭할 때 실행되는 핸들러
   */
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // 3. 이미 로딩 중이면 중복 클릭 방지
    if (isLoading) return;

    // 4. 옵티미스틱 UI: API 요청 전에 UI를 즉시 업데이트
    // 현재 상태의 반대로 변경 (true -> false, false -> true)
    const newIsAlarmState = !isActive; 
    setIsActive(newIsAlarmState);
    setIsLoading(true);

    try {
      // 6. 실제 API 통신 실행
      await setAlramSchedule(scheduleId, newIsAlarmState);
      
      console.log('알림 상태 변경 성공:', { scheduleId, isAlarm: newIsAlarmState });

    } catch (error) {
      // 7. 실패: UI 롤백 (치명적!)
      console.error('알림 상태 변경 실패! 롤백합니다.', error);
      setIsActive(!newIsAlarmState); // UI를 이전 상태로 강제 롤백
      
      toast.error('알림 설정 변경에 실패했습니다. 다시 시도해주세요.');

    } finally {
      // 8. 성공/실패와 관계없이 로딩 상태 해제
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading} // 로딩 중에는 버튼 비활성화
      className={`
        relative rounded-full transition-colors duration-200
        ${isActive 
          ? 'text-blue-600 hover:bg-blue-100' // 활성화 상태 (종 아이콘 색깔)
          : 'text-gray-400 hover:bg-gray-100'} // 비활성화 상태
        ${isLoading && 'opacity-50 cursor-wait'} // 로딩 중
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`스케쥴 ${isActive ? '알림 켜짐' : '알림 꺼짐'}`}
      title={`스케쥴 ${isActive ? '알림 켜짐' : '알림 꺼짐'}`}
    >
      {/* 로딩 중일 때 스피너를 보여줄 수도 있습니다. */}
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        // 종 모양 SVG 아이콘 (Heroicons 등에서 가져올 수 있습니다)
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isActive ? (
            // 알림 켜짐 (종 아이콘)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          ) : (
            // 알림 꺼짐 (종 아이콘 + 사선)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9m-9.143-9.932a.84.84 0 011.171-1.196l15.698 15.698a.84.84 0 01-1.196 1.171L3.857 6.068z"
            />
          )}
        </svg>
      )}
    </button>
  );
}