import UpperNav from "@/components/UpperNav"
import MainCalendar from "./components/MainCalender"
import { useEffect, useState } from "react"
import { getCalendarApi } from "@/apis/calendar";
import type { CalendarData } from "@/types/calendar-types";
import { dummyCalender } from "./constants";

const CalenderPage = () => {
    const today = new Date();  
    const nowYear = today.getFullYear();
    const nowMonth = today.getMonth()

    const [requestYM, setRequestYM] = useState({
        year: nowYear,
        month: nowMonth
    })
    const [data, setData] = useState<CalendarData[]>([]);

    const getResult = async(year:number, month:number)=>{
        return await getCalendarApi(year, month);
    }

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
                <MainCalendar data={data} />        
            </main>
        </div>
    )
}

export default CalenderPage