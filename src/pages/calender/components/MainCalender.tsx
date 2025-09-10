import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { YearMonth } from "@/types/calendar-types";
import { CreateScheduleDialog } from "./CreateScheduleDialog";
import { useState } from "react";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import type { GetScheduleByYearAndMonthResponse } from "@/generated-api/Api";

interface MainCalendarProps {
  data?: GetScheduleByYearAndMonthResponse[];
  setRequestYM: React.Dispatch<React.SetStateAction<YearMonth>>;
}

const MainCalendar = ({ data, setRequestYM }: MainCalendarProps) => {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);

  const showEvent = (event: GetScheduleByYearAndMonthResponse) => {
    if (event) {
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
          key={`event-${event.scheduleId ?? Math.random()}`}
          className={`bg-muted ${typeBarColor} relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full`}
          onClick={() => handleScheduleClick(event.scheduleId ?? -1)}
        >
          <div className="flex justify-between font-medium">
            {event.title}
            <span
              className={`w-14 text-center rounded-[5px] ${typeBlockColor} text-white`}
            >
              {type}
            </span>
          </div>
          <div className="text-muted-foreground text-xs">
            {event.startDateTime} 부터 ~{event.endDateTime} 까지
          </div>
        </div>
      );
    } else {
      return <span>일정 데이터 로드 오류</span>;
    }
  };
  const stringToDate = (stringDate: number[]) => {
    // console.log("@@@", stringDate, Array.isArray(stringDate), typeof stringDate[0]);
    // console.log("!!!",today.getDate().toString())
    // const [year, month, day] = stringDate.split("-").map(Number);

    if (stringDate) {
      const [year, month, day] = stringDate;
      return new Date(year, month - 1, day);
    }
    return today
  };

  // const isInRange = (event: GetScheduleByYearAndMonthResponse) => {
    const isInRange = (event: any) => {
    // event의 start, endDateTime이 undifined라면 오늘 날짜정보로 대체
    return (
      date &&
      stringToDate(event.startDateTime) <=
        date &&
      stringToDate(event.endDateTime) >= date
    );
  };

  const isInData = (year: number, month: number, day: number) => {
    const comp = new Date(year, month, day);
    const filtered = (data ?? []).filter((d:any) => {
      if (d.startDateTime && d.endDateTime) {
        return (
          date &&
          stringToDate(d.startDateTime) <= comp &&
          stringToDate(d.endDateTime) >= comp
        );
      }
    });
    // console.log(filtered);
    if (filtered.length > 0) {
      let isExt = false;
      let isNorm = false;
      filtered.forEach((f) => {
        if (f.scheduleType === "EXTRACURRICULAR") {
          isExt = true;
        }
        if (f.scheduleType === "NORMAL") {
          isNorm = true;
        }
      });
      if (isExt && isNorm) {
        return (
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span className="w-1 h-1 rounded-full bg-blue-500" />
          </div>
        );
      } else if (isNorm) {
        return <div className="w-1 h-1 rounded-full bg-blue-500" />;
      } else if (isExt) {
        return <div className="w-1 h-1 rounded-full bg-red-500" />;
      } else return null;
    } else {
      return null;
    }
  };

  const handleScheduleClick = (id: number) => {
    setSelectedId(id);
    setIsOpenDialog(true);
  };

  return (
    <Card className="w-full py-4">
      {isOpenDialog && (
        <CreateScheduleDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          scheduleId={selectedId}
        />
      )}
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onMonthChange={(monthDateObject) => {
            const newYear = monthDateObject.getFullYear(); // 예: 2025
            const newMonth = monthDateObject.getMonth() + 1; // 예: 9 (0-11이므로 +1)
            setRequestYM({ year: newYear, month: newMonth });
          }}
          className="bg-transparent p-0"
          required
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const year = day.date.getFullYear();
              const month = day.date.getMonth();
              const date = day.date.getDate();
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {isInData(year, month, date)}
                </CalendarDayButton>
              );
            },
          }}
          locale={ko}
          formatters={{
            formatCaption: (date) => {
              return format(date, "yyyy년 M월", { locale: ko });
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("kr-KR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
            // 0번 스케쥴 아이디를, 생성용으로 지정
            onClick={() => handleScheduleClick(0)}
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {(data ?? []).map((event) => (
            <>{isInRange(event) ? showEvent(event) : null}</>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MainCalendar;
