import { useNavigate } from "react-router-dom";

type LowerNavIconProps = {
    imageOnSrc: string;
    imageOffSrc : string;
    isSelected: boolean;
    text : string;
}

const LowerNavIcon = ({ imageOnSrc, imageOffSrc, isSelected, text }: LowerNavIconProps) => {
    
    const navigate = useNavigate()
    
    const navName : Record<string, string> = {
        "캘린더" : "calender",
        "리뷰" : "review",
        "시간표" : "timetable",
        "마이" : "mypage/profile"
    }

    const handleClick = () =>{
        navigate(`/main/${navName[text]}`);
    }
    return (
        <div className="flex flex-col w-[44px] h-[44px]
            justify-center items-center"
            onClick={handleClick}>
            {isSelected ? <>
                <img className="w-6 h-6" src={imageOnSrc} />
                <div className="w-10 h-4 mt-1 text-center justify-start text-[#08AC64] text-xs font-light font-['Pretendard'] leading-none tracking-wide">{text}<br /></div>
            </> : <>
                <img className="w-6 h-6" src={imageOffSrc} />
                <div className="w-10 h-4 mt-1 text-center justify-start text-black text-xs font-light font-['Pretendard'] leading-none tracking-wide">{text}<br /></div></>
            }
        </div>
    )
}

export default LowerNavIcon;