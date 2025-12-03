import UpperNav from "@/components/UpperNav";
import { ReviewItem } from "./components/ReviewItem";
import { useEffect, useState } from "react";
import {
  getReviewList,
  postReview,
  searchReview,
  getMyReviewList,
  searchMyReview,
  deleteMyReview,
} from "@/apis/review";
import type {
  PageResponseReviewResponse,
  CreateReviewRequest,
} from "@/generated-api/Api";
import { Search } from "lucide-react";
import { ReviewWriteModal } from "./components/ReviewWriteModal";
import toast from "react-hot-toast";

// 탭 모드 타입 정의
type ViewMode = "ALL" | "MY";

const ReviewPage = () => {
  // 1. 상태 관리
  const [reviewList, setReviewList] = useState<PageResponseReviewResponse>({
    data: [],
  });
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("ALL"); // '전체' vs '내 리뷰'
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 2. 데이터 불러오기 함수 (재사용을 위해 분리)
  const fetchReviews = async (mode: ViewMode, query: string = "") => {
    try {
      let result;
      // 검색어가 있는 경우
      if (query.trim()) {
        const searchParam = { key: query };
        result =
          mode === "ALL"
            ? await searchReview(searchParam)
            : await searchMyReview(searchParam);
      }
      // 검색어가 없는 경우 (전체 목록)
      else {
        result =
          mode === "ALL" ? await getReviewList() : await getMyReviewList();
      }
      if (result) setReviewList(result);
    } catch (error) {
      console.error("리뷰 로드 실패:", error);
      toast.error("리뷰 로드 실패");
      setReviewList({ data: [] }); // 에러 시 빈 배열
    }
  };

  // 3. 초기 로드 및 탭 변경 시 데이터 갱신
  useEffect(() => {
    // 탭이 바뀌면 검색어 초기화 후 해당 탭 데이터 로드
    setSearchText("");
    fetchReviews(viewMode, "");
  }, [viewMode]);

  // 4. 검색 핸들러
  const handleSearch = async () => {
    await fetchReviews(viewMode, searchText);
  };

  // 5. 리뷰 작성 핸들러
  const handleCreateReview = async (data: CreateReviewRequest) => {
    try {
      await postReview(data);
      toast.success("리뷰가 등록되었습니다.");
      // 작성 후 목록 갱신 (현재 탭 유지)
      await fetchReviews(viewMode, searchText);
    } catch (error) {
      console.error(error);
      toast.error("리뷰 등록에 실패했습니다.");
    }
  };

  // 6. 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId: number) => {
    // if(!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      await deleteMyReview({ deleteReviewId: reviewId });
      toast.success("삭제되었습니다.");
      // 삭제 후 목록 갱신
      await fetchReviews(viewMode, searchText);
    } catch (error) {
      console.error(error);
      toast.error("삭제 실패");
    }
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
        <button
          className={`flex-1 py-3 font-bold ${
            viewMode === "ALL"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-400"
          }`}
          onClick={() => setViewMode("ALL")}
        >
          전체 리뷰
        </button>
        <button
          className={`flex-1 py-3 font-bold ${
            viewMode === "MY"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-400"
          }`}
          onClick={() => setViewMode("MY")}
        >
          내가 쓴 리뷰
        </button>
      </div>

      <div className="flex flex-col p-4 gap-4 pb-20">
        {" "}
        {/* pb-20: 플로팅 버튼 여백 확보 */}
        {/* 검색 창 */}
        <div className="flex p-2 justify-between items-center rounded-xl gap-3 bg-[#f9f9f9] border focus-within:border-green-500 transition-colors">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder={viewMode === "ALL" ? "전체 리뷰 검색" : "내 리뷰 검색"}
            className="flex-1 bg-transparent outline-none py-1"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            value={searchText}
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
          {reviewList?.data && reviewList.data.length > 0 ? (
            reviewList.data.map((review) => (
              <ReviewItem
                key={review.reviewId}
                reviewId={review.reviewId!}
                title={review.title ?? "비교과 활동"}
                content={review.content ?? ""}
                star={review.star ?? "FIVE"}
                // '내 리뷰' 탭이거나, (추후 로직) 작성자 ID 체크 로직 추가 가능
                isMyReview={viewMode === "MY"}
                onDelete={handleDeleteReview}
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
        onSubmit={handleCreateReview}
      />
    </div>
  );
};

export default ReviewPage;
