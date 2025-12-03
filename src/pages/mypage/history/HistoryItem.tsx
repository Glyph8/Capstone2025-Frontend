import { CheckCircle2, PenLine } from "lucide-react";

interface HistoryItemProps {
  title: string;
  isReviewed: boolean;
  onClick: () => void; // 클릭 이벤트 핸들러 추가
}

const HistoryItem = ({ title, isReviewed, onClick }: HistoryItemProps) => {
  return (
    <div 
      // [UX] 리뷰 미작성 시 클릭 가능함을 나타내는 스타일 (cursor-pointer, hover)
      className={`flex justify-between items-center w-full p-4 mb-3 border rounded-xl transition-all shadow-sm bg-white
        ${!isReviewed ? "cursor-pointer hover:border-green-500 hover:shadow-md active:scale-[0.99]" : "border-gray-100 opacity-80"}`}
      onClick={() => !isReviewed && onClick()}
    >
      <div className="flex flex-col gap-1 w-[85%]">
        <span className={`font-medium text-[15px] truncate ${isReviewed ? "text-gray-500" : "text-gray-900"}`}>
          {title}
        </span>
        {/* 부가 정보가 있다면 여기에 추가 (예: 날짜) */}
      </div>

      <div className="flex-shrink-0 ml-2">
        {isReviewed ? (
          <div className="flex flex-col items-center text-green-600">
             {/* [UI] 아이콘 변경 (Lucide React 사용 권장) */}
            <CheckCircle2 size={24} />
            <span className="text-[10px] font-bold mt-1">완료</span>
          </div>
        ) : (
          <button 
            className="flex flex-col items-center text-gray-400 hover:text-green-600 transition-colors"
            aria-label="리뷰 작성하기"
          >
            <PenLine size={24} />
            <span className="text-[10px] font-medium mt-1">작성</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;