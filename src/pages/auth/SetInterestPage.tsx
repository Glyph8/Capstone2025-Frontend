import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { enrollInterest } from "../../apis/auth";
import WideAcceptButton from "../../components/WideAcceptButton";
import InterestGrid from "./InterestGrid"; // 경로 확인 필요

const SetInterestPage = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<string[]>([]);

  const handleSubmit = async () => {
    // 선택사항이라면 검사 생략 가능, 필수라면 아래 주석 해제
    // if (interests.length === 0) {
    //   toast("관심사를 1개 이상 선택해주세요.", { icon: "🤔" });
    //   return;
    // }

    try {
      const result = await enrollInterest(interests);
      if (result) {
        navigate("/auth/academic-info");
      }
    } catch (error) {
      console.error(error);
      toast.error("관심사 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-28">
      {/* 상단 타이틀 영역 (회원가입 흐름에 맞게 디자인) */}
      <header className="px-5 pt-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">관심 정보 선택</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          관심있는 카테고리를 선택해주세요.<br />
          선택된 정보를 바탕으로 맞춤 활동을 추천해 드립니다.
        </p>
      </header>

      <main className="w-full px-5">
        {/* InterestGrid를 감싸는 흰색 카드 영역 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center items-center">
          <InterestGrid interests={interests} setInterests={setInterests} />
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          관심사는 나중에 마이페이지에서 수정할 수 있습니다.
        </p>
      </main>

      {/* 하단 고정 버튼 (Sticky Footer) */}
      <div className="flex justify-center items-center p-5 pb-8 safe-area-bottom fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-10">
        <div className="w-full max-w-md"> {/* max-w-md로 너무 넓어지는 것 방지 */}
            <WideAcceptButton
            text="다음으로"
            isClickable={true} 
            handleClick={handleSubmit}
            />
        </div>
      </div>
    </div>
  );
};

export default SetInterestPage;