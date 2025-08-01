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
                <div className="flex flex-col mt-3 gap-2 overflow-y-scroll no-scrollbar">
                    {/* <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인123214124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인21412412412421"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} /> */}
                </div>
            </main>
        </div>
    )
}

export default CalenderPage