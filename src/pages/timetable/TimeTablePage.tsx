import UpperNav from "../../components/UpperNav.tsx";
import TimeTableLabel from "./TimeTableLabel.tsx";
import TimeTableGrid from "./TimeTableGrid.tsx";
import { useAddTimeTableStore } from "../../store/store.ts";

const TimeTablePage = () => {
    const { setIsEditing } = useAddTimeTableStore();
    return (
        <div className="w-full h-full overflow-auto">
            <UpperNav text="2025년 1학기" otherBtn="edit-timetable" handleBtn={setIsEditing} />
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