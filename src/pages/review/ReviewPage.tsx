import UpperNav from "@/components/UpperNav"
import { ReviewItem } from "./components/ReviewItem"
import { useEffect, useState } from "react"
import { getReviewList } from "@/apis/review"
import { dummyReviewList } from "./constants"
import type { PageResponseReviewResponse } from "@/generated-api/Api"
import { Search } from "lucide-react"
const ReviewPage = () => {
    const [reviewListInfo, setReviewListInfo] = useState<PageResponseReviewResponse>();
        useEffect(()=>{
            const process = async ()=>{
                try{
                    const result = await getReviewList();
                    setReviewListInfo(result);
                }catch(error){
                    console.error(error);
                    console.log("더미 리뷰 데이터 로드")
                    setReviewListInfo(dummyReviewList);
                }finally{
                    console.log("Review api finally")
                }
            } 
            process();
        }, [])
    return (
        <div className="w-full h-full bg-white">
            <UpperNav text={"리뷰"} />
            <div className="flex flex-col p-4 gap-4">
                <div className="flex p-2 justify-between items-center rounded-xl  gap-3 bg-[#f9f9f9]">
                    <Search className="flex-1"/>
                    <input type="text" placeholder="조회할 리뷰 항목을 입력해주세요" 
                    className="flex-4 py-2"/>
                    <button className="flex-1">
                        검색
                    </button>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {
                        (reviewListInfo?.data ?? []).map((review)=>{
                            // return <span>{review.content} {review.star}</span>
                            return <ReviewItem content={review.content} star={review.star} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ReviewPage