interface ReviewItemProps{

}

export const ReviewItem = ({reviewId, content, star}:ReviewItemProps) => {

    return(
        <div>
            <div>
                {content}
            </div>
            <div>
                {star}
            </div>
            <button>
                삭제 버튼
            </button>
        </div>
    )
}