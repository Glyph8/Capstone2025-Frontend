import type { GetScheduleByYearAndMonthResponse } from "@/generated-api/Api";
import { formatKoreanDateTimeNative } from "@/utils/date";
import { AlarmIconButton } from "./AlarmItemSwitch";

interface ScheduleItemProps {
  event: GetScheduleByYearAndMonthResponse;
  onClick: (id: number) => void;
}

export const ScheduleItem = ({ event, onClick }: ScheduleItemProps) => {
  if (!event) {
    return <span>일정 데이터 로드 오류</span>;
  }

  let type = "--";
  let typeBarColor = "#fff";
  let typeBlockColor = "#fff";

  if (event.scheduleType === "EXTRACURRICULAR") {
    type = "비교과";
    typeBarColor = "after:bg-red-500";
    typeBlockColor = "bg-red-500";
  } else {
    type = "일반";
    typeBarColor = "after:bg-blue-500";
    typeBlockColor = "bg-blue-500";
  }

  return (
    <div
      className={`bg-muted ${typeBarColor} mb-2 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full`}
      onClick={() => onClick(event.scheduleId ?? -1)}
    >
      <div className="flex justify-between font-medium">
        {event.title}
        <div className="flex justify-center gap-2">
          <span
            className={`w-14 p-1 text-center rounded-[5px] ${typeBlockColor} text-white`}
          >
            {type}
          </span>
          <AlarmIconButton
            scheduleId={Number(event.scheduleId)}
            // TODO : 추후 상태 추가
            initialIsAlarm={event.isAlarm ?? false}
          />
        </div>
      </div>
      <div className="text-muted-foreground text-xs">
        {formatKoreanDateTimeNative(event.startDateTime ?? "")} 부터 ~
        {formatKoreanDateTimeNative(event.endDateTime ?? "")} 까지
      </div>
    </div>
  );
};
