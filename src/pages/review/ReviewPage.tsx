import UpperNav from "@/components/UpperNav";
import { ReviewItem } from "./components/ReviewItem";
import { useEffect, useState } from "react";
import { getReviewList, postReview } from "@/apis/review";
import { dummyReviewList } from "./constants";
import type {
  CreateReviewRequest,
  PageResponseReviewResponse,
} from "@/generated-api/Api";
import { Search } from "lucide-react";
const ReviewPage = () => {
  const [reviewListInfo, setReviewListInfo] =
    useState<PageResponseReviewResponse>();
  const handlePostReview = async () => {
    const review: CreateReviewRequest = {
      extracurricularId: 2,
      content: "테스트 2번 비교과 입니다다다다",
      star: "FOUR",
    };
    const response = await postReview(review);
    if (response) console.log("게시 성공");
    else alert("게시 실패");
  };
  useEffect(() => {
    const process = async () => {
      try {
        const result = await getReviewList();
        setReviewListInfo(result);
      } catch (error) {
        console.error(error);
        console.log("더미 리뷰 데이터 로드");
        setReviewListInfo(dummyReviewList);
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
          />
          <button className="flex-1">검색</button>
        </div>
        <div className="w-full p-4 flex flex-col border-1 border-gray-500 rounded-4xl">
          임시 리뷰 게시 ui. 히스토리에서만 추가 가능하게 할 듯?
          <input
            type="text"
            placeholder="리뷰 대상 비교과 항목을 입력해주세요"
            className="flex-4 py-2"
          />
          <input
            type="text"
            placeholder="리뷰 내용을 작성해주세요"
            className="flex-4 py-2"
          />
          <input
            type="text"
            placeholder="해당 활동의 별점을 부여해주세요"
            className="flex-4 py-2"
          />
          <button className="flex-1" onClick={handlePostReview}>
            게시하기
          </button>
        </div>
        <div className="w-full flex flex-col gap-3">
          {(reviewListInfo?.data ?? []).map((review) => {
            // return <span>{review.content} {review.star}</span>
            return (
              <ReviewItem
                title={review.title}
                content={review.content}
                star={review.star}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
