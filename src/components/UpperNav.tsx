import { useAddTimeTableStore } from "@/store/store";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
type UpperNavProps = {
    text: string;
    otherBtn?: string;
    handleBtn?: () => void;
}

const UpperNav = ({ text, otherBtn, handleBtn }: UpperNavProps) => {
    const navigate = useNavigate()
    const { isEditing} = useAddTimeTableStore();
    return (
            <header className="w-full h-16 p-4 flex flex-row justify-between items-center bg-[#FCFFFF] shadow-sm z-10">
                <div className="flex-1 justify-center items-center gap-2.5" onClick={() => {
                    navigate(-1)
                }}>
                    <img src={"/icons/arrow-left.svg"} alt="arrow-left" />
                </div>
                <div className="flex-4 w-32 h-5 flex flex-col text-center justify-center text-Schemes-On-Surface text-lg font-normal font-['Pretendard'] leading-5">
                    {text}
                </div>
                <div className="flex-1 flex justify-end items-center">
                    {otherBtn === "edit-timetable" ? 
                    <button type="button" onClick={handleBtn}> 
                    {isEditing ? <X color="#005B3F"/> : <Plus color="#005B3F"/> }
                    </button> : <> </>}
                </div>
            </header>
    )
}

export default UpperNav