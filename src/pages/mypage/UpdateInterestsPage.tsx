import { useState } from "react";
import { enrollInterest } from "../../apis/auth";
import WideAcceptButton from "../../components/WideAcceptButton";
import { useNavigate } from "react-router-dom";
import InterestGrid from "../auth/InterestGrid";
import UpperNav from "@/components/UpperNav";

const UpdateInterestPage = () => {
    const [interests, setInterests] = useState<string[]>([])
    const navigate = useNavigate()

    const handleClick = async () => {
        console.log("관심 목록 전송")
        console.log(interests)

        try {
            const result = await enrollInterest(interests);
            if (result)
                navigate('/auth/academic-info')
            else
                alert("try 요청 성공하였으나 result false")

        } catch {
            console.log("흥미 입력 전송에 에러 발생")
        }

    }
    return (
        <div className="w-full flex flex-col justify-between items-center ">
            <UpperNav text="관심 키워드 수정" />
            <div className="w-full px-5">
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

            <div className="absolute bottom-22 px-5">
                <WideAcceptButton text={"변경 사항 저장하기"} isClickable={true} handleClick={handleClick} />
            </div>
        </div>
    )
}

export default UpdateInterestPage;