import type { RatingValue, StarRatingProps } from "@/types/review-types";
import { RATING_MAP } from "../constants";
import { Trash2 } from "lucide-react";

interface ReviewItemProps {
  reviewId: number; // 삭제를 위해 필수
  extracurricularId?: number;
  title: string;
  content: string;
  star: string;
  isMyReview?: boolean; // 내 리뷰인지 여부
  onDelete?: (id: number) => void; // 삭제 핸들러
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
    <path
      strokeWidth="1.5"
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
    />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const numericRating = RATING_MAP[rating] || 0;
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }, (_, index) => (
        <span key={index}>
          {index < numericRating ? <FilledStar /> : <EmptyStar />}
        </span>
      ))}
    </div>
  );
};

export const ReviewItem = ({
  reviewId,
  title,
  content,
  star,
  isMyReview = false,
  onDelete,
}: ReviewItemProps) => {
  return (
    <div className="flex flex-col gap-2 w-full p-4 border-green-800 border rounded-xl bg-white shadow-sm relative group">
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-[15px]">{title}</h2>
        {/* 내 리뷰일 때만 삭제 버튼 노출 */}
        {isMyReview && onDelete && (
          <button
            onClick={() => onDelete(reviewId)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="리뷰 삭제"
          >
            <Trash2 size={16} /> {/* 혹은 "삭제" 텍스트 */}
          </button>
        )}
      </div>

      <div className="relative -left-1">
        <StarRating rating={star as RatingValue} />
      </div>

      <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};
