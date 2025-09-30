import type { LocalTime, MakeMemberTimetableRequest } from "@/generated-api/Api";
import type { SelectedCellState } from "@/store/store";

const SelectedCell = ({
  selectedCell,
  clearCells,
}: Omit<SelectedCellState, "updateCell">) => {
  const formatScheduleFromObject = (sCell:MakeMemberTimetableRequest) => {
    // 요일 매핑 객체는 이전과 동일하게 사용합니다.
    const dayMap = {
      MON: "월요일",
      TUE: "화요일",
      WED: "수요일",
      THU: "목요일",
      FRI: "금요일",
      SAT: "토요일",
      SUN: "일요일",
    };

    // sCell 객체가 없거나 day 정보가 없는 경우를 위한 방어 코드
    if (!sCell || !sCell.day) {
      return "표시할 시간 정보가 없습니다.";
    }
    // 시간 객체({ hour, minute })를 받아 포맷팅하는 헬퍼 함수
    const formatTime = (time: LocalTime | undefined) => {
      if (!time) {
        return "";
      }
      // 분이 0이면 '시'만, 아니면 '시'와 '분'을 모두 표시합니다.
      return time.minute === 0
        ? `${time.hour}시`
        : `${time.hour}시 ${time.minute}분`;
    };

    const koreanDay = dayMap[sCell.day];
    const formattedStartTime = formatTime(sCell.startTime);
    const formattedEndTime = formatTime(sCell.endTime);

    return `${koreanDay} ${formattedStartTime} ~ ${formattedEndTime}`;
  };

  return (
    <div className="flex flex-row justify-between">
      <div
        className="relative top-7 left-6 box-content justify-center
                w-56 text-black text-sm font-semibold font-['Roboto'] leading-none tracking-wide"
      >
        {selectedCell.map((sCell) => {
          console.log(sCell);
          return <div>{formatScheduleFromObject(sCell)}</div>;
        })}
      </div>

      <div
        className="flex justify-center items-center relative top-7 right-7
                w-20 h-7 bg-[#08AC64] rounded-2xl
                 text-white text-xs font-normal font-[Pretendard]"
        onClick={clearCells}
      >
        선택취소
      </div>
    </div>
  );
};

export default SelectedCell;
