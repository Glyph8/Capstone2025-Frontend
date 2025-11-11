import UpperNav from "@/components/UpperNav";
import MainCalendar from "./components/MainCalender";
import { useEffect, useState } from "react";
import { getCalendarApi } from "@/apis/calendar";
import { dummyCalender } from "./constants";
import type { YearMonth } from "@/types/calendar-types";
import type { GetScheduleByYearAndMonthResponse } from "@/generated-api/Api";

const CalenderPage = () => {
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

const handleSendNotification = async () => {
  const token = "eRwj-O3AmpE-o-HFw7NKCX:APA91bHe3_lKAFCp03UxqIlF3nB6Tpv4jIC_Ie7XBOqXQLy2ONeA71uxVjgMjEf1DagmTf0tpmaRWvDAa15uLTaOCNAuVMPs-zqrA-EWFAi1DcILF-iQoKQ";

  try {
    console.log('서버로 요청 전송 중...');
    
    const response = await fetch('http://localhost:3001/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        title: "테스트 알림",
        body: "백엔드를 통한 푸시 알림입니다!",
        data: {
          customKey: "customValue"
        }
      })
    });

    console.log('응답 상태:', response.status);
    
    // 응답 본문 확인
    const text = await response.text();
    console.log('응답 본문:', text);
    
    // JSON 파싱 시도
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('JSON 파싱 실패:', text);
      alert(`서버 에러: ${text.substring(0, 100)}`);
      return;
    }

    if (data.success) {
      alert('알림 전송 성공!');
      console.log('FCM 응답:', data.data);
    } else {
      alert(`알림 전송 실패: ${JSON.stringify(data.error)}`);
    }
  } catch (error) {
    console.error('네트워크 오류:', error);
    alert(`알림 전송 중 오류 발생: ${error.message}`);
  }
};
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
      <UpperNav text="2025년 1학기"></UpperNav>
      <button className="border-1"
      onClick={handleSendNotification}>
        푸시
      </button>
      <main className="p-4">
        <MainCalendar data={data} setRequestYM={setRequestYM} onScheduleChange={fetchData}/>
      </main>
    </div>
  );
};

export default CalenderPage;
