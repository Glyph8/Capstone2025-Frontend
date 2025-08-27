import UpperNav from "@/components/UpperNav"
import { ReviewItem } from "./components/ReviewItem"
import { useEffect } from "react"

const ReviewPage = () => {
    useEffect(()=>{
        
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
                <ReviewItem/>
            </div>
        </div>
    )
}

export default ReviewPage