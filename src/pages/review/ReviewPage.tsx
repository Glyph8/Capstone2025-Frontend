import UpperNav from "@/components/UpperNav"
import { ReviewItem } from "./components/ReviewItem"
import { useEffect, useState } from "react"
import { getReviewList } from "@/apis/review"
import { dummyReviewList } from "./constants"
import type { PageResponseReviewResponse } from "@/generated-api/Api"

const ReviewPage = () => {
    const [reviewListInfo, setReviewListInfo] = useState<PageResponseReviewResponse>();
        useEffect(()=>{
            const process = async()=>{
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
        <div className="w-full h-full">
            <UpperNav text={"리뷰"} />
            <div className="flex flex-col p-4">
                <div className="flex">
                    <input type="text" placeholder="조회할 리뷰 항목을 입력해주세요" />
                    <button>
                        검색
                    </button>
                </div>

                <div className="w-full">
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