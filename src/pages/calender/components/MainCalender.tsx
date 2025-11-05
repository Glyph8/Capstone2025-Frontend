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
import { getDateOnly } from "@/utils/date";
import { ScheduleItem } from "./ScheduleItem";

interface MainCalendarProps {
  data?: GetScheduleByYearAndMonthResponse[];
  setRequestYM: React.Dispatch<React.SetStateAction<YearMonth>>;
  onScheduleChange: () => void;
}

const MainCalendar = ({ data, setRequestYM, onScheduleChange }: MainCalendarProps) => {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);

  // 선택된 날짜에 해당하는 일정인지 확인
  const isInRange = (event: GetScheduleByYearAndMonthResponse) => {
    if (!date || !event.startDateTime || !event.endDateTime) {
      return false;
    }
    const selectedDate = getDateOnly(date);
    const startDate = getDateOnly(new Date(event.startDateTime));
    const endDate = getDateOnly(new Date(event.endDateTime));

    // 선택된 날짜가 시작일과 종료일 사이에 있는지 확인 (양 끝 포함)
    return selectedDate >= startDate && selectedDate <= endDate;
  };

  // 특정 날짜에 일정이 있는지 확인하고 표시
  const isInData = (year: number, month: number, day: number) => {
    const compareDate = getDateOnly(new Date(year, month, day));
    
    const filtered = (data ?? []).filter((d) => {
      if (d.startDateTime && d.endDateTime) {
        const startDate = getDateOnly(new Date(d.startDateTime));
        const endDate = getDateOnly(new Date(d.endDateTime));
        
        // compareDate가 시작일과 종료일 사이에 있는지 확인 (양 끝 포함)
        return compareDate >= startDate && compareDate <= endDate;
      }
      return false;
    });

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

      // 비교과와 일반이 모두 있는 경우
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
      }
    }
    
    return null;
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
          onSuccess={onScheduleChange}
        />
      )}
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onMonthChange={(monthDateObject) => {
            const newYear = monthDateObject.getFullYear();
            const newMonth = monthDateObject.getMonth() + 1;
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
            onClick={() => handleScheduleClick(0)}
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
    <div className="flex w-full flex-col">
          {(data ?? []).map((event) => (
            <div className="h-fit" key={event.scheduleId}>
              {isInRange(event) ? (
                <ScheduleItem 
                  event={event} 
                  onClick={handleScheduleClick} 
                />
              ) : null}
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MainCalendar;