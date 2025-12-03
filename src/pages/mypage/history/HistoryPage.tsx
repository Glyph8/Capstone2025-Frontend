import { useEffect, useState, useMemo } from "react";
import UpperNav from "../../../components/UpperNav";
import HistoryItem from "./HistoryItem";
import type { ReviewResponse, CreateReviewRequest, ExtracurricularResponse } from "@/generated-api/Api";
import { getMyHistoryList } from "@/apis/mypage";
import { postReview } from "@/apis/review"; // 리뷰 작성 API import
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { ReviewWriteModal } from "@/pages/review/components/ReviewWriteModal";

const HistoryPage = () => {
    // 1. 상태 관리
    const [searchText, setSearchText] = useState("");
    const [historyList, setHistoryList] = useState<ReviewResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 모달 관련 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달에 넘겨줄 선택된 활동 정보
    const [selectedActivity, setSelectedActivity] = useState<ExtracurricularResponse | null>(null);

    // 2. 데이터 불러오기
    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await getMyHistoryList();
            // 최신순 정렬 등 필요한 전처리 수행 가능
            setHistoryList(response?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("활동 내역을 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // 3. 클라이언트 사이드 필터링 (useMemo로 성능 최적화)
    // [포트폴리오 포인트]: 서버 부하를 줄이고 UX 반응성을 위해 클라이언트 필터링 적용
    const filteredHistory = useMemo(() => {
        if (!searchText.trim()) return historyList;
        return historyList.filter(item => 
            item.title?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, historyList]);

    // 4. 핸들러 함수들
    const handleItemClick = (item: ReviewResponse) => {
        // 이미 리뷰를 쓴 항목은 클릭 방지 (HistoryItem에서도 막지만 이중 방어)
        if (item.star) return;

        // ReviewResponse 타입을 ExtracurricularResponse 타입으로 변환하여 모달에 전달
        const activityData: ExtracurricularResponse = {
            id: item.extracurricularId,
            title: item.title,
            // 필요한 다른 필드들...
        };

        setSelectedActivity(activityData);
        setIsModalOpen(true);
    };

    const handleCreateReview = async (data: CreateReviewRequest) => {
        try {
            await postReview(data);
            toast.success("리뷰가 등록되었습니다.");
            
            // 리뷰 작성 후 목록 갱신 (작성 완료 상태 반영을 위해)
            await fetchHistory(); 
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("리뷰 등록 실패");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F9F9F9] pb-12">
            <UpperNav text="활동 히스토리" />
            
            <div className="max-w-md mx-auto pt-6 px-5 pb-20">
                
                {/* 검색 바 */}
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

                {/* 리스트 영역 */}
                <div className="flex flex-col gap-2">
                    {/* 로딩 상태 처리 */}
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            {/* 스피너 컴포넌트 혹은 텍스트 */}
                            <span className="text-gray-400 text-sm">로딩 중...</span>
                        </div>
                    ) : (
                        <>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item) => (
                                    <HistoryItem 
                                        key={item.reviewId || item.extracurricularId || Math.random()} // 고유 키 보장
                                        title={item.title || "제목 없음"} 
                                        isReviewed={!!item.star} // star가 있으면 리뷰 완료로 간주
                                        onClick={() => handleItemClick(item)}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <span className="text-sm">
                                        {searchText ? `'${searchText}' 검색 결과가 없습니다.` : "참여한 활동 내역이 없습니다."}
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
                onSubmit={handleCreateReview}
                initialData={selectedActivity} // [중요] 선택된 활동 전달
            />
        </div>
    )
}

export default HistoryPage;