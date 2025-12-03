import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { enrollInterest } from "../../apis/auth";
import { getMyInterest } from "@/apis/mypage";
import WideAcceptButton from "../../components/WideAcceptButton";
import InterestGrid from "../auth/InterestGrid";
import UpperNav from "@/components/UpperNav";
import Skeleton from "@/components/Skeleton";

const UpdateInterestPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);

  // 1. 기존 관심사 불러오기 (Pre-filling)
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setIsLoading(true);
        const data = await getMyInterest();
        if (data && Array.isArray(data.interests)) {
          setInterests(data.interests);
        } else if (Array.isArray(data)) {
          setInterests(data);
        }
      } catch (error) {
        console.error("관심사 조회 실패", error);
        toast.error("기존 관심사를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterests();
  }, []);

  // 2. 수정사항 저장 핸들러
  const handleSubmit = async () => {
    if (interests.length === 0) {
      toast("관심사를 1개 이상 선택해주세요.", { icon: "🤔" });
      return;
    }

    try {
      const result = await enrollInterest(interests);
      if (result) {
        toast.success("관심사가 수정되었습니다.");
        navigate("/main/mypage/profile");
      } else {
        toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("관심사 저장 에러", error);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 보여줄 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <UpperNav text="관심 키워드 수정" />
        <div className="px-5 mt-6">
          <Skeleton className="w-1/2 h-6 mb-2 rounded" />
          <Skeleton className="w-3/4 h-4 mb-8 rounded" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-28">
      <UpperNav text="관심 키워드 수정" />

      <main className="w-full px-5 pt-6">
        {/* 설명 및 카드 섹션 */}
        <section className="mb-6">
          <div className="pl-1 mb-2">
            <h2 className="text-lg font-bold text-gray-900">관심 정보 선택</h2>
            <p className="text-sm text-gray-500 mt-1">
              선택하신 키워드를 기반으로 <br />
              맞춤형 비교과 활동을 추천해 드립니다.
            </p>
          </div>

          {/* InterestGrid를 감싸는 흰색 카드 영역 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center items-center mt-4">
            <InterestGrid interests={interests} setInterests={setInterests} />
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            관심사는 언제든지 다시 수정할 수 있습니다.
          </p>
        </section>
      </main>

      <div className="flex justify-center items-center p-5 pb-8 safe-area-bottom z-10 transition-all">
        <WideAcceptButton
          text="변경 사항 저장하기"
          isClickable={true} // 항상 클릭 가능하거나, interests.length > 0 조건 추가
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UpdateInterestPage;
