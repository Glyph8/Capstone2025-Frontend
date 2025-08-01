import * as React from "react"
import { Calendar, CalendarDayButton, } from "@/components/ui/calendar"
// import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { CalendarData } from "@/types/calendar-types"

// {
//   "result": [
//     {
//       "scheduleId": 1,
//       "title": "A비교과",
//       "scheduleType": "EXTRACURRICULAR(비교과 관련), NORMAL(일반 일정)",
//       "startDate": "2025-07-19",
//       "endDate": "2025-07-20"
//     }
//   ]
// }

interface MainCalendarProps {
  data: CalendarData[];
}

const MainCalendar = ({ data }: MainCalendarProps) => {
  const today = new Date();
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  )

  const showEvent = (event: CalendarData) => {
    if (event) {
      let type = "--";
      let typeBarColor = "#fff";
      let typeBlockColor = "#fff";
      if (event.scheduleType === "EXTRACURRICULAR"){
        type = "비교과";
        typeBarColor = "after:bg-red-500"
        typeBlockColor = "bg-red-500"
      }
        
      else{
        type = "일반";
        typeBarColor = "after:bg-blue-500";
        typeBlockColor = "bg-blue-500";
      }
        
      return (
        <div
          key={event.title}
          className={`bg-muted ${typeBarColor} relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full`}
        >
          <div className="flex justify-between font-medium">
            {event.title}
            <span className={`w-14 text-center rounded-[5px] ${typeBlockColor} text-white`}>
              {type}
            </span>

          </div>
          <div className="text-muted-foreground text-xs">
            {event.startDate} 부터 ~
            {event.endDate} 까지
          </div>
        </div>
      )

    } else {
      return <span>일정 데이터 로드 오류</span>
    }


  }

  const stringToDate = (stringDate: string) => {
    const [year, month, day] = stringDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const isInRange = (event: CalendarData) => {
    return date && (stringToDate(event.startDate) <= date && stringToDate(event.endDate) >= date)
  }

  const isInData = (year: number, month: number, day: number) => {
    const comp = new Date(year, month, day)
    const filtered = data.filter((d) => {
      return date && (stringToDate(d.startDate) <= comp && stringToDate(d.endDate) >= comp)
    })
    console.log(filtered);
    if (filtered.length > 0) {
      let isExt = false;
      let isNorm = false;
      filtered.map((f) => {
        if (f.scheduleType === "EXTRACURRICULAR") {
          isExt = true;
        }
        if (f.scheduleType === "NORMAL") {
          isNorm = true;
        }
      })
      if (isExt && isNorm) {
        return (<div className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          <span className="w-1 h-1 rounded-full bg-blue-500" />
        </div>
        )
      }
      else if (isNorm) {
        return <div className="w-1 h-1 rounded-full bg-blue-500" />;
      }
      else if (isExt) {
        return <div className="w-1 h-1 rounded-full bg-red-500" />;
      }
      else
        return null;
    }
    else {
      return null;
    }
  }


  return (
    <Card className="w-full py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
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
              )
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
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
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {data.map((event) => (
            <>
              {isInRange(event) ? (
                showEvent(event)
              ) : null}
            </>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default MainCalendar;