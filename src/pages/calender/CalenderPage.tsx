import UpperNav from "@/components/UpperNav";
import MainCalendar from "./components/MainCalender";
import { useEffect, useState } from "react";
import { getCalendarApi } from "@/apis/calendar";
import { dummyCalender } from "./constants";
import type { YearMonth } from "@/types/calendar-types";
// import type { GetScheduleByYearAndMonthResponse } from "@/generated-api/Api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CalenderPage = () => {
  const queryClient = useQueryClient();
  const [dateText, setDateText] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];

      const formatted =
        `${now.getFullYear()}년 ${
          now.getMonth() + 1
        }월 ${now.getDate()}일 (${day}) ` +
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;

      setDateText(formatted);
    };

    updateTime(); // 최초 1회만
    const timer = setInterval(updateTime, 1000); // 1초마다 갱신

    return () => clearInterval(timer);
  }, []);

const today = new Date();
  const [requestYM, setRequestYM] = useState<YearMonth>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  // 추후 필요시 refetch도 구조 분해 할당
  const { data: calendarData } = useQuery({
    queryKey: ['calendar', requestYM.year, requestYM.month], 
    queryFn: async () => {
      try {
        const result = await getCalendarApi(requestYM.year, requestYM.month);
        return result || []; 
      } catch (error) {
        console.error("캘린더 로드 실패", error);
        return dummyCalender; 
      }
    },
    staleTime: 1000 * 60 * 5, 
  });

  const handleScheduleChange = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['calendar', requestYM.year, requestYM.month] 
    });
    // 또는 refetch() 호출
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll no-scrollbar">
      <UpperNav text={dateText}></UpperNav>
      <main className="p-4">
        <MainCalendar
          data={calendarData} // Query로 가져온 데이터 주입
          setRequestYM={setRequestYM}
          onScheduleChange={handleScheduleChange}
        />
      </main>
    </div>
  );
};

export default CalenderPage;