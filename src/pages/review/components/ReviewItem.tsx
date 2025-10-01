import type { RatingValue, StarRatingProps } from "@/types/review-types";
import { RATING_MAP } from "../constants";

interface ReviewItemProps{
    reviewId? : number;
    extracurricularId?: number;
    title: string;
    content : string;
    star: string;
}

// 채워진 별 아이콘
const FilledStar = () => (
  <svg
    className="w-8 h-8 text-yellow-400"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// 빈 별 아이콘
const EmptyStar = () => (
  <svg
    className="w-8 h-8 text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
     {/* 채워진 별과 동일한 path를 사용하되, fill="none" stroke="currentColor"로 테두리만 그립니다. */}
    <path strokeWidth="1.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const numericRating = RATING_MAP[rating]; // props로 받은 문자열을 숫자로 변환합니다.
  const totalStars = 5; // 전체 별의 개수는 5개로 고정합니다.

  return (
    <div className="flex items-center">
      {/* 선언적 렌더링: 
        Array.from을 사용해 길이가 5인 배열을 만들고, map을 돌며 각 인덱스를 별점으로 활용합니다.
        index가 현재 평점(numericRating)보다 작으면 채워진 별, 아니면 빈 별을 렌더링합니다.
      */}
      {Array.from({ length: totalStars }, (_, index) => (
        <span key={index}>
          {index < numericRating ? <FilledStar /> : <EmptyStar />}
        </span>
      ))}
    </div>
  );
};

export const ReviewItem = ({title, content, star}:ReviewItemProps) => {
    return(
        <div className="flex flex-col gap-2 w-full p-4 border-green-800 border-1 rounded-xl ">
            <h2 className="font-bold text-[15px]">
                {title}
            </h2>
            <div className="relative right-1.5">
                <StarRating rating={star as RatingValue} />
            </div>
            {/* 추후 사용자의 리뷰와 다른 사용자의 리뷰 구분해서 보여주도록 */}
            {/* <button onClick={handleDelete}>
                삭제 버튼
            </button> */}
            <div className="text-[13px]">
                {content}
            </div>
        </div>
    )
}