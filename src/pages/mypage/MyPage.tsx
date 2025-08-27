import { useNavigate } from "react-router-dom";
import UpperNav from "../../components/UpperNav";
import WideAcceptButton from "../../components/WideAcceptButton";

const MyPage = () => {
    const navigate = useNavigate();
    const id = "DummyId"

    const handleAcademicInfo = () => {
        navigate("/main/mypage/academic-info");
    }

    const handleInterest = () => {
        navigate("/main/mypage/interest");
    }

    const handleReviewBtn = () => {
        navigate("/main/mypage/history");
    }

    const handleLogout = () => {
        localStorage.removeItem("access-token");
        // 필요시, 전역 상태, 캐시, 리프레쉬 토큰도 제거
        navigate('/auth/login');
    }

    return (
        <div className="w-full h-full">
            <UpperNav text="회원정보" />
            <div className="w-full bg-white px-11">
                <nav className="flex flex-col justify-start items-start pt-8">
                    <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold leading-7">
                        회원 정보 수정
                    </div>

                    <div className="w-full">
                        <div className="h-14 py-2 flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                            {id}@konkuk.ac.kr
                        </div>

                        <div className="h-14 py-2 flex justify-between items-center text-black text-base font-light leading-none tracking-wide">
                            학적정보 수정
                            <button onClick={handleAcademicInfo}>
                                <img src="/icons/arrow-right.svg" alt="다음버튼" />
                            </button>
                        </div>

                        <div className="h-14 py-2 flex justify-between items-center text-black text-base font-light font-['Pretendard'] leading-none tracking-wide">
                            관심 카테고리 수정
                            <button onClick={handleInterest}>
                                <img src="/icons/arrow-right.svg" alt="다음 버튼"/>
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="w-full flex flex-col justify-center items-center mt-16">
                    <WideAcceptButton text="히스토리 조회 및 리뷰작성" isClickable={true} handleClick={handleReviewBtn} />
                    <div className="mt-32 text-black text-sm font-normal
            underline leading-loose"
                        onClick={handleLogout}>
                        로그아웃
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage;