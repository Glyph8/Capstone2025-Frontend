import { useNavigate } from "react-router-dom";
type UpperNavProps = {
    text: string;
    otherBtn?: string;
    handleBtn?: () => void;
}

const UpperNav = ({ text, otherBtn, handleBtn }: UpperNavProps) => {
    const navigate = useNavigate()
    return (
        <div className="w-full h-16 p-4 flex flex-row justify-between items-center bg-[#FCFFFF] shadow-[0px_0.20000000298023224px_2px_0px_rgba(0,0,0,0.25)]">
            <div className="inline-flex justify-center items-center gap-2.5" onClick={() => {
                navigate(-1)
            }}>
                <img src={"/icons/arrow-left.svg"} alt="arrow-left" />
            </div>
            <div className="w-32 h-5 flex flex-col text-center justify-center text-Schemes-On-Surface text-lg font-normal font-['Pretendard'] leading-5">
                {text}
            </div>
            <div>
                {otherBtn === "edit-timetable" ? <div onClick={handleBtn}> 편집버튼 </div> : null}
            </div>
        </div>
    )
}

export default UpperNav