// src/pages/timetable/components/SelectedCell.tsx

import type { LocalTime } from "@/generated-api/Api";
import type { SelectedCellState } from "@/store/store";
import { toMinutes } from "./EditTableDrawer";

// Helper: 분 단위 변환 및 정렬용

const SelectedCell = ({
  selectedCell,
  clearCells,
}: Pick<SelectedCellState, "selectedCell" | "clearCells">) => {
  
  // 선택된 셀이 없으면 렌더링 안 함
  if (!selectedCell || selectedCell.length === 0) return null;

  // 1. 요일 가져오기 (첫 번째 셀 기준)
  const dayRaw = selectedCell[0].day;
  const dayMap: Record<string, string> = {
    MON: "월요일", TUE: "화요일", WED: "수요일", THU: "목요일", FRI: "금요일", SAT: "토요일", SUN: "일요일",
  };
  const dayStr = dayRaw ? dayMap[dayRaw] : "";

  // 2. 전체 셀 중 가장 빠른 시작 시간과 가장 늦은 종료 시간 찾기
  // (드래그 순서가 뒤죽박죽일 수 있으므로 정렬 필요)
  const sortedCells = [...selectedCell].sort((a, b) => 
      toMinutes(a.startTime) - toMinutes(b.startTime)
  );

  const startTimeObj = sortedCells[0].startTime;
  const endTimeObj = sortedCells[sortedCells.length - 1].endTime;

  const formatTime = (time: LocalTime | undefined) => {
    if (!time) return "";
    return time.minute === 0 ? `${time.hour}시` : `${time.hour}시 ${time.minute}분`;
  };

  return (
    <div className="flex flex-row justify-between items-center px-1"> {/* items-center로 수직 중앙 정렬 */}
      <div className="text-black text-sm font-semibold font-['Roboto'] leading-none tracking-wide">
         {/* 병합된 정보 하나만 표시 */}
         {dayStr} {formatTime(startTimeObj)} ~ {formatTime(endTimeObj)}
         <span className="ml-2 text-xs text-gray-500 font-normal">
            ({selectedCell.length * 30}분)
         </span>
      </div>

      <div
        className="flex justify-center items-center px-3 py-1.5 bg-[#08AC64] hover:bg-[#068f53] rounded-full cursor-pointer transition-colors"
        onClick={clearCells}
      >
        <span className="text-white text-xs font-medium font-[Pretendard]">선택취소</span>
      </div>
    </div>
  );
};

export default SelectedCell;