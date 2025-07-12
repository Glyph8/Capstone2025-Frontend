import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const [guidePage, setGuidePage] = useState('guide-1.svg')
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center w-full h-[648px] bg-[#f5f5f5]">
                <img src={guidePage} className="w-90 h-full object-cover object-bottom"/> 
                </div>
            <div className="w-[66px] h-[48px] flex justify-center gap-1.5 mt-5">
                <div className="w-[12px] h-[12px] rounded-full bg-[#005B3F]" style={{backgroundColor:'#144221'}} onClick={() => setGuidePage('guide-1.svg')}></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]" onClick={() => setGuidePage('guide-2.svg')}></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]" onClick={() => setGuidePage('guide-3.svg')}></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]" onClick={() => setGuidePage('guide-4.svg')}></div>
            </div>
            
            <div className="w-full flex flex-row">
                <button className="w-[55%] 
                h-[44px] rounded-[10px] ml-[39px] mr-[6px]
                bg-[#43BB6B] text-[#FCFFFF] text-center font-pretendard text-sm font-bold leading-7" onClick={() => {
                        navigate('/auth/login')
                    }}>로그인</button>
                <button className="w-[55%] 
                h-[44px] rounded-[10px] mr-[39px] ml-[6px]
                bg-[#43BB6B] text-[#FCFFFF] text-center font-pretendard text-sm font-bold leading-7" onClick={() => {
                        navigate('/auth/signup')
                    }}>회원가입</button>
            </div>
            <div className="w-full flex justify-center mt-4">
                <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">계정이 기억나지 않나요? </span>
                <span className="text-[#000] text-center font-pretendard text-sm font-bold leading-7">계정 찾기</span>
            </div>

        </div>
    )
}

export default LandingPage