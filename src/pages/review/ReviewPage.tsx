import UpperNav from "@/components/UpperNav";
import { ReviewItem } from "./components/ReviewItem";
import { useEffect, useState } from "react";
import { getReviewList, postReview, searchReview } from "@/apis/review";
import { dummyReviewList } from "./constants";
import type {
  CreateReviewRequest,
  PageResponseReviewResponse,
} from "@/generated-api/Api";
import { Search } from "lucide-react";
const ReviewPage = () => {
  const [originalReviewList, setOriginalReviewList] =
    useState<PageResponseReviewResponse>();
  const [displayedReviewList, setDisplayedReviewList] =
    useState<PageResponseReviewResponse>();

  const [searchText, setSearchText] = useState("");
  const handleSearchReview = async () => {
    // 검색어가 비어있으면 아무것도 하지 않거나, 전체 목록을 다시 보여줄 수 있습니다.
    if (!searchText.trim()) {
      setDisplayedReviewList(originalReviewList);
      return;
    }
    try {
      const result = await searchReview({ key: searchText });
      setDisplayedReviewList(result); // 검색 결과를 화면에 표시
    } catch (error) {
      console.error("검색 실패:", error);
      // 검색 실패 시 사용자에게 알림을 주거나 빈 목록을 보여줄 수 있습니다.
      setDisplayedReviewList({ ...displayedReviewList, data: [] });
    }
  };
  // const handlePostReview = async () => {
  //   const review: CreateReviewRequest = {
  //     extracurricularId: 18,
  //     content: "정말 최고의 비교과 활동이었습니다. 다른 사람들도 꼭 해보라고 추천하고 싶어요. 다음에 또 한다면 반드시 참석할 것 같습니다. 최고에요",
  //     star: "FIVE",
  //   };
  //   const response = await postReview(review);
  //   if (response) console.log("게시 성공");
  //   else alert("게시 실패");
  // };
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // 검색어를 바꾸면 즉시 원본 리스트로 화면을 되돌립니다.
    setDisplayedReviewList(originalReviewList);
  };

  useEffect(() => {
    const process = async () => {
      try {
        const result = await getReviewList();
        // 4. 최초 로딩 시 두 상태를 모두 초기화합니다.
        setOriginalReviewList(result);
        setDisplayedReviewList(result);
      } catch (error) {
        console.error(error);
        console.log("더미 리뷰 데이터 로드");
        setOriginalReviewList(dummyReviewList);
        setDisplayedReviewList(dummyReviewList);
      } finally {
        console.log("Review api finally");
      }
    };
    process();
  }, []);
  return (
    <div className="w-full h-full bg-white">
      <UpperNav text={"리뷰"} />
      <div className="flex flex-col p-4 gap-4">
        <div className="flex p-2 justify-between items-center rounded-xl  gap-3 bg-[#f9f9f9]">
          <Search className="flex-1" />
          <input
            type="text"
            placeholder="조회할 리뷰 항목을 입력해주세요"
            className="flex-4 py-2"
            onChange={handleSearchTextChange}
            value={searchText}
          />
          <button className="flex-1" onClick={handleSearchReview}>
            검색
          </button>
        </div>
        <div className="w-full flex flex-col gap-3">
          {(displayedReviewList?.data ?? []).map((review) => {
            // return <span>{review.content} {review.star}</span>
            return (
              <ReviewItem
                title={review.title ?? ""}
                content={review.content ?? ""}
                star={review.star ?? ""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
