import UpperNav from "../../components/UpperNav.tsx";
import TimeTableLabel from "./components/TimeTableLabel.tsx";
import TimeTableGrid from "./components/TimeTableGrid.tsx";
import { useEffect, useState } from "react";

const TimeTablePage = () => {
    const [dateText, setDateText] = useState("");
     useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
            
            const formatted =
                `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${day}) `
                + `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

            setDateText(formatted);
        };

        updateTime();                // 최초 1회 실행
        const timer = setInterval(updateTime, 1000);  // 1초마다 갱신

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-full overflow-auto">
            <UpperNav text={dateText} />
            <div className="bg-[#005B3F]">
                <TimeTableLabel />
                <div className="h-full no-scrollbar p-4 box-border">
                    <TimeTableGrid />
                </div>
            </div>
        </div>
    )
}
export default TimeTablePage