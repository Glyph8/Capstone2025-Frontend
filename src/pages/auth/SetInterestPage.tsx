import { useState } from "react";
import { enrollInterest } from "../../apis/auth";
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

        if (result) {
            navigate('/auth/academic-info')
        }
        else {
            // 임시 시연용
            navigate('/auth/academic-info')
        }

    }
    return (
        <div className="w-full flex flex-col justify-between items-center">
            <div >
                <nav className="flex flex-col justify-start items-start mt-8">
                    <div className="w-full h-12 text-black text-xl font-semibold font-['Pretendard'] leading-7">
                        관심 정보
                    </div>
                    <div className="w-full h-8 text-black text-base font-medium font-['Pretendard'] leading-7">
                        관심있는 카테고리를 0개 이상 선택해주세요
                    </div>
                </nav>
                <div className="w-full flex flex-col justify-center items-center mt-12">
                    <InterestGrid interests={interests} setInterests={setInterests} />
                </div>
            </div>

            <div className="absolute bottom-22">
                <WideAcceptButton text={"마지막으로"} isClickable={true} handleClick={handleClick} />
            </div>
        </div>
    )
}

export default SetInterestPage;