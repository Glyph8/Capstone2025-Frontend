import { useState, useMemo } from "react";
import UpperNav from "../../../components/UpperNav";
import HistoryItem from "./HistoryItem";
import type {
  ReviewResponse,
  CreateReviewRequest,
  ExtracurricularResponse,
} from "@/generated-api/Api";
import { getMyHistoryList } from "@/apis/mypage";
import { postReview } from "@/apis/review";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { ReviewWriteModal } from "@/pages/review/components/ReviewWriteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const HistoryPage = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<ExtracurricularResponse | null>(null);

  const { data: historyList = [], isLoading } = useQuery({
    queryKey: ["myHistory"],
    queryFn: async () => {
      const response = await getMyHistoryList();
      return response?.data || [];
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewRequest) => postReview(data),
    onSuccess: () => {
      toast.success("리뷰가 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["myHistory"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      setIsModalOpen(false);
    },
    onError: () => toast.error("리뷰 등록 실패"),
  });

  const filteredHistory = useMemo(() => {
    if (!searchText.trim()) return historyList;
    return historyList.filter((item: ReviewResponse) =>
      item.title?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, historyList]);

  const handleItemClick = (item: ReviewResponse) => {
    console.log("클릭한 아이템:", item);

    if (item.star) return;
    const targetId = item.id || item.extracurricularId;
    if (!targetId) return;

    setSelectedActivity({
      id: targetId,
      title: item.title || "제목 없음",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] pb-12">
      <UpperNav text="활동 히스토리" />

      <div className="max-w-md mx-auto pt-6 px-5 pb-20">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="활동 이름으로 검색"
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all shadow-sm text-sm"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="text-gray-400 text-sm">로딩 중...</span>
            </div>
          ) : (
            <>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const historyItem = item as any;
                  <HistoryItem
                    key={item.id || Math.random()} // 고유 키 보장
                    title={item.title || "제목 없음"}
                    isReviewed={!!historyItem.star}
                    onClick={() => handleItemClick(item)}
                  />;
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <span className="text-sm">
                    {searchText
                      ? `'${searchText}' 검색 결과가 없습니다.`
                      : "참여한 활동 내역이 없습니다."}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 리뷰 작성 모달 */}
      <ReviewWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
            await createReviewMutation.mutateAsync(data);
        }}
        initialData={selectedActivity} // [중요] 선택된 활동 전달
      />
    </div>
  );
};

export default HistoryPage;
