import UpperNav from "@/components/UpperNav"
import MainCalendar from "./components/MainCalender"
import { TodoListItem } from "./components/todoListItem"
import { useEffect } from "react"

const CalenderPage = () => {

    useEffect(()=>{
        
    }, [])

    return (
        <div className="flex flex-col justify-between w-full h-full overflow-y-scroll no-scrollbar">
            <UpperNav text="2025년 1학기" />
            <main className="p-6 mt-[57px]">
                <MainCalendar />
                <div className="flex flex-col mt-3 gap-2 overflow-y-scroll no-scrollbar">
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인123214124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인21412412412421"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                    <TodoListItem title={"[공학혁신사업단]2025 창의융합 캡스톤디자인124124124124124"} handleClick={() => console.log("일정 클릭")} />
                </div>
            </main>
        </div>
    )
}

export default CalenderPage