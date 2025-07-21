interface HistoryItemProps{
    title: string;
    isReviewed : boolean;
}

const HistoryItem = ({title, isReviewed}:HistoryItemProps) =>{

    return(
        <div className="inline-flex justify-between items-center w-full h-11 border-b-1 px-4 mb-[11px]">
            <span className="w-[85%] overflow-x-hidden whitespace-nowrap text-ellipsis">
                {title}
            </span>

            {isReviewed ? (
                <button className="w-6 h-6">
                    <img src="/icons/review-icon-off.svg" alt="리뷰완료"/>
                </button>
            ):(
                <button className="w-6 h-6">
                    <img src="/icons/review-icon-on.svg" alt="리뷰미완료"/>
                </button>
            )}
        </div>
    )
}

export default HistoryItem;