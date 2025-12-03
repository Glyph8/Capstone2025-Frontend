import UpperNav from "@/components/UpperNav";
import MainCalendar from "./components/MainCalender";
import { useEffect, useState } from "react";
import { getCalendarApi } from "@/apis/calendar";
import { dummyCalender } from "./constants";
import type { YearMonth } from "@/types/calendar-types";
import type { GetScheduleByYearAndMonthResponse } from "@/generated-api/Api";

const CalenderPage = () => {
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

    updateTime(); // 최초 1회 실행
    const timer = setInterval(updateTime, 1000); // 1초마다 갱신

    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;

  const [requestYM, setRequestYM] = useState<YearMonth>({
    year: nowYear,
    month: nowMonth,
  });

  const [data, setData] = useState<
    GetScheduleByYearAndMonthResponse[] | undefined
  >([]);

  const fetchData = async () => {
    try {
      const result = await getCalendarApi(requestYM.year, requestYM.month);
      console.log("달력 데이터 로드 : ", result);
      setData(result);
    } catch (error) {
      console.error(error);
      console.log("더미 데이터 로드");
      setData(dummyCalender);
    } finally {
      console.log("CalendarPage api finally");
    }
  };
  useEffect(() => {
    fetchData();
  }, [requestYM.month, requestYM.year]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll no-scrollbar">
      {/* 상단바 제거하는 스타일링 고려 */}
      <UpperNav text={dateText}></UpperNav>
      <main className="p-4">
        <MainCalendar
          data={data}
          setRequestYM={setRequestYM}
          onScheduleChange={fetchData}
        />
      </main>
    </div>
  );
};

export default CalenderPage;
