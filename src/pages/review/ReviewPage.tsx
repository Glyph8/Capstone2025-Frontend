// src/pages/review/ReviewPage.tsx

import UpperNav from "@/components/UpperNav";
import { ReviewItem } from "./components/ReviewItem";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // import
import {
  getReviewList,
  postReview,
  searchReview,
  getMyReviewList,
  searchMyReview,
  deleteMyReview,
} from "@/apis/review";
import { Search } from "lucide-react";
import { ReviewWriteModal } from "./components/ReviewWriteModal";
import toast from "react-hot-toast";
import type { CreateReviewRequest } from "@/generated-api/Api";

type ViewMode = "ALL" | "MY";

const ReviewPage = () => {
  const queryClient = useQueryClient();
  
  // 상태 관리
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 검색어 상태 (입력값 vs 실제 검색에 적용된 값 분리)
  const [inputText, setInputText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState(""); 

  // ✅ [TanStack Query] 리뷰 목록 조회
  // queryKey에 viewMode와 appliedSearch를 포함시켜 이 값들이 변하면 자동 재요청됨
  const { data: reviewList, isLoading, isError } = useQuery({
    queryKey: ['reviews', viewMode, appliedSearch], 
    queryFn: async () => {
      const isSearch = !!appliedSearch.trim();
      const searchParam = { key: appliedSearch };

      // 조건에 따른 API 호출 분기 처리
      if (viewMode === "ALL") {
        return isSearch ? await searchReview(searchParam) : await getReviewList();
      } else {
        return isSearch ? await searchMyReview(searchParam) : await getMyReviewList();
      }
    },
    // 이전 데이터를 유지해서 탭 전환 시 깜빡임 방지 (UX 향상)
    placeholderData: (previousData) => previousData, 
  });

  // ✅ [TanStack Query] 리뷰 작성 Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateReviewRequest) => postReview(data),
    onSuccess: () => {
      toast.success("리뷰가 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['reviews'] }); // 목록 새로고침
      setIsModalOpen(false);
    },
    onError: () => toast.error("리뷰 등록 실패"),
  });

  // ✅ [TanStack Query] 리뷰 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteMyReview({ deleteReviewId: reviewId }),
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['reviews'] }); // 목록 새로고침
    },
    onError: () => toast.error("삭제 실패"),
  });

  // 검색 핸들러 (버튼 클릭 or 엔터 시 쿼리 상태 업데이트)
  const handleSearch = () => {
    setAppliedSearch(inputText);
  };

  return (
    <div className="w-full min-h-screen bg-white relative">
      <UpperNav
        text={"리뷰"}
        otherBtn="review"
        handleBtn={() => setIsModalOpen(true)}
      />

      {/* 탭 전환 버튼 */}
      <div className="flex border-b">
        {/* ... (기존 탭 UI 유지, onClick에서 setViewMode만 호출하면 됨) ... */}
        <button
          className={`flex-1 py-3 font-bold ${viewMode === "ALL" ? "border-b-2 border-green-600 text-green-600" : "text-gray-400"}`}
          onClick={() => {
            setViewMode("ALL");
            setAppliedSearch(""); // 탭 변경 시 검색어 초기화
            setInputText("");
          }}
        >
          전체 리뷰
        </button>
        <button
          className={`flex-1 py-3 font-bold ${viewMode === "MY" ? "border-b-2 border-green-600 text-green-600" : "text-gray-400"}`}
          onClick={() => {
            setViewMode("MY");
            setAppliedSearch("");
            setInputText("");
          }}
        >
          내가 쓴 리뷰
        </button>
      </div>

      <div className="flex flex-col p-4 gap-4 pb-20">
        {/* 검색 창 */}
        <div className="flex p-2 justify-between items-center rounded-xl gap-3 bg-[#f9f9f9] border focus-within:border-green-500 transition-colors">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder={viewMode === "ALL" ? "전체 리뷰 검색" : "내 리뷰 검색"}
            className="flex-1 bg-transparent outline-none py-1"
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            value={inputText}
          />
          <button
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>

        {/* 리뷰 리스트 */}
        <div className="w-full flex flex-col gap-3">
          {isLoading ? (
             <div className="text-center py-10">로딩 중...</div>
          ) : isError ? (
             <div className="text-center py-10 text-red-500">에러가 발생했습니다.</div>
          ) : reviewList?.data && reviewList.data.length > 0 ? (
            reviewList.data.map((review) => (
              <ReviewItem
                key={review.id}
                reviewId={review.id!}
                title={review.title ?? "비교과 활동"}
                content={review.content ?? ""}
                star={review.star ?? "FIVE"}
                isMyReview={viewMode === "MY"}
                // 삭제 함수 연결
                onDelete={(id) => deleteMutation.mutate(id)} 
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      <ReviewWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // Mutation 실행 연결
            onSubmit={async (data) => {
            await createMutation.mutateAsync(data);
        }}
      />
    </div>
  );
};

export default ReviewPage;