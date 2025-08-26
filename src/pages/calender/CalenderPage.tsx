import UpperNav from "@/components/UpperNav"
import MainCalendar from "./components/MainCalender"
import { useEffect, useState } from "react"
import { getCalendarApi } from "@/apis/calendar";
import { dummyCalender } from "./constants";
import type { GetScheduleByYearAndMonthResponse } from "@/api/Api";
import type { YearMonth } from "@/types/calendar-types";

const CalenderPage = () => {
    const today = new Date();  
    const nowYear = today.getFullYear();
    const nowMonth = today.getMonth()

    const [requestYM, setRequestYM] = useState<YearMonth>({
        year: nowYear,
        month: nowMonth
    })

    const [data, setData] = useState<GetScheduleByYearAndMonthResponse[]|undefined>([]);

    const getResult = async(year:number, month:number)=>{
        return await getCalendarApi(year, month);
    }
// GetScheduleDetailResponse
    useEffect(()=>{
        const process = async()=>{
            try{
                const result = await getResult(requestYM.year, requestYM.month );
                setData(result);
            }catch(error){
                console.error(error);
                console.log("더미 데이터 로드")
                setData(dummyCalender);
            }finally{
                console.log("CalendarPage api finally")
            }
        } 
        process();
    }, [])

    return (
        <div className="flex flex-col justify-between w-full h-full overflow-y-scroll no-scrollbar">
            <UpperNav text="2025년 1학기" />
            <main className="py-4 px-4 mt-[57px]">
                <MainCalendar data={data} setRequestYM={setRequestYM}/>        
            </main>
        </div>
    )
}

export default CalenderPage