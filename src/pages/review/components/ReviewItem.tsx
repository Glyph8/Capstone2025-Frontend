interface ReviewItemProps{
    reviewId? : number;
    extracurricularId?: number;
    title?: string;
    content? : string;
    star?: string;
}

export const ReviewItem = ({title, content, star}:ReviewItemProps) => {
    return(
        <div className="w-full py-2 px-4 border-green-800 border-2 rounded-xl ">
            <div>
                {title}
            </div>
            <div>
                {content}
            </div>
            <div>
                {star}
            </div>
            {/* 추후 사용자의 리뷰와 다른 사용자의 리뷰 구분해서 보여주도록 */}
            {/* <button onClick={handleDelete}>
                삭제 버튼
            </button> */}
        </div>
    )
}