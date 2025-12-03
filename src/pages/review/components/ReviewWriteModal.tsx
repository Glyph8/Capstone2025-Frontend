import { useState, useEffect } from "react";
import type { CreateReviewRequest, ExtracurricularResponse } from "@/generated-api/Api";
import { searchExtracurricular } from "@/apis/extracurricular"; // 경로 확인 필요
import { X, Search, Check, Loader2 } from "lucide-react";

interface ReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewRequest) => Promise<void>;
  initialData?: ExtracurricularResponse | null;
}

export const ReviewWriteModal = ({ isOpen, onClose, onSubmit, initialData }: ReviewWriteModalProps) => {
  // 리뷰 데이터 상태
  const [content, setContent] = useState("");
  const [star, setStar] = useState<"ONE" | "TWO" | "THREE" | "FOUR" | "FIVE">("FIVE");
  
  // 비교과 검색 및 선택 상태
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<ExtracurricularResponse[]>([]);
  const [selectedExtra, setSelectedExtra] = useState<ExtracurricularResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false); // 로딩 상태

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedExtra(initialData); // 외부에서 받은 데이터로 설정
        setKeyword(initialData.title ?? "");
      } else {
        // 초기 데이터가 없으면 초기화
        setKeyword("");
        setSelectedExtra(null);
      }
      // 공통 초기화
      setContent("");
      setStar("FIVE");
      setSearchResults([]);
    }
  }, [isOpen, initialData]);

  // 검색어 입력 시 Debouncing 처리 (포트폴리오 강조 포인트)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword.trim() && !selectedExtra) {
        setIsSearching(true);
        try {
          const result = await searchExtracurricular(keyword);
          if(result)
            setSearchResults(result.data || []);
        } catch (error) {
          console.error("비교과 검색 실패", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else if (!keyword.trim()) {
        setSearchResults([]);
      }
    }, 500); // 0.5초 딜레이

    return () => clearTimeout(timer); // cleanup 함수
  }, [keyword, selectedExtra]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedExtra) return alert("리뷰를 작성할 비교과 활동을 선택해주세요.");
    if (!content.trim()) return alert("내용을 입력해주세요.");
    
    const requestData: CreateReviewRequest = {
      extracurricularId: selectedExtra.id, // 선택된 비교과 ID 사용
      content,
      star,
    };

    await onSubmit(requestData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
            <X size={24} />
        </button>
        
        <h2 className="text-lg font-bold mb-4">리뷰 작성하기</h2>
        
        <div className="flex flex-col gap-4">
            {/* 1. 비교과 검색/선택 영역 */}
            <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-semibold text-gray-700">활동 선택</label>
                
                {selectedExtra ? (
                  // 선택 완료 시 보여줄 UI
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Check size={18} />
                      <span className="font-medium truncate">{selectedExtra.title}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedExtra(null);
                        setKeyword("");
                        setSearchResults([]);
                      }}
                      className="text-xs text-gray-500 underline whitespace-nowrap ml-2"
                    >
                      다시 검색
                    </button>
                  </div>
                ) : (
                  // 검색 입력창
                  <div className="relative">
                    <input 
                        type="text" 
                        placeholder="활동명을 검색하세요 (예: AI 특강)"
                        value={keyword} 
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full border p-2 pl-9 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      {isSearching ? <Loader2 size={18} className="animate-spin"/> : <Search size={18} />}
                    </div>

                    {/* 검색 결과 드롭다운 */}
                    {keyword && !selectedExtra && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((item) => (
                            <li 
                              key={item.id}
                              onClick={() => {
                                setSelectedExtra(item);
                                setKeyword(item.title ?? ''); // 입력창에도 제목 표시
                                setSearchResults([]); // 목록 닫기
                              }}
                              className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors text-sm"
                            >
                              {item.title}
                            </li>
                          ))
                        ) : (
                          !isSearching && (
                            <li className="p-3 text-gray-400 text-sm text-center">
                              검색 결과가 없습니다.
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                )}
            </div>

            {/* 2. 별점 선택 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">별점</label>
              <select 
                  value={star} 
                  onChange={(e) => setStar(e.target.value as "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE")}
                  className="border p-2 rounded-lg bg-white"
              >
                  <option value="FIVE">⭐⭐⭐⭐⭐ (5점)</option>
                  <option value="FOUR">⭐⭐⭐⭐ (4점)</option>
                  <option value="THREE">⭐⭐⭐ (3점)</option>
                  <option value="TWO">⭐⭐ (2점)</option>
                  <option value="ONE">⭐ (1점)</option>
              </select>
            </div>

            {/* 3. 내용 입력 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">리뷰 내용</label>
              <textarea
                  className="border p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="이 활동을 통해 무엇을 배우셨나요? 다른 학우들에게 도움이 되는 솔직한 후기를 남겨주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!selectedExtra || !content.trim()}
                className={`py-3 rounded-lg font-bold transition flex justify-center items-center gap-2
                  ${(!selectedExtra || !content.trim()) 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  }`}
            >
                등록하기
            </button>
        </div>
      </div>
    </div>
  );
};