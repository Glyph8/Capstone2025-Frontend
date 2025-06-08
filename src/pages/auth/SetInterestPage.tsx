import { useState } from "react";
import { enrollInterest } from "../../apis/auth";
import UpperNav from "../../components/UpperNav";
import WideAcceptButton from "../../components/WideAcceptButton";
import InterestGrid from "./InterestGrid";
import { useNavigate } from "react-router-dom";

const SetInterestPage = () => {
    const [interests, setInterests] = useState<string[]>([])
    const navigate = useNavigate()

    const handleClick = async () => {
        console.log("관심 목록 전송")
        console.log(interests)

        const result = await enrollInterest(interests)

        if(result){
            navigate('/auth/academic-info')
        }
        else{
            // 임시 시연용
            navigate('/auth/academic-info')
        }
        
    }
    return (
        <div className="flex flex-col justify-between items-center
        h-full">
            <UpperNav text="회원가입" otherBtn="None" />
            <nav>
                <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">관심 정보</div>
                <div className="w-96 h-8 text-center justify-start text-black text-base font-medium font-['Pretendard'] leading-7">관심있는 카테고리를 0개 이상 선택해주세요</div>
            </nav>

            <InterestGrid interests={interests} setInterests={setInterests}/>
        
            <WideAcceptButton text={"마지막으로"} isClickable={true} handleClick={handleClick} />

        </div>
    )
}

export default SetInterestPage;