type WideAcceptButtonProps = {
    text: string;
    isClickable: boolean;
    handleClick: () => void;
}

const WideAcceptButton = ({ text, isClickable, handleClick }: WideAcceptButtonProps) => {
    return (
        <div className="">
            {isClickable ? (<>
                <div className="w-[290px] h-[45px] rounded-[500px] bg-[#01A862] flex justify-center items-center"
                    onClick={handleClick}>
                    {/*클릭 가능 상태*/}
                    <div className="w-full h-[27px] flex-shrink-0 text-[#FCFFFF] text-center font-[Pretendard] text-[17px] not-italic font-medium leading-[28px]">
                        {text}
                    </div>
                </div>
            </>) : (<>
                <div className="w-[290px] h-[45px] rounded-[500px] bg-[#01A86266] flex justify-center items-center ">
                    {/*클릭 불가 상태 회색*/}
                    <div className="w-[162px] h-[27px] flex-shrink-0 text-[#FCFFFF] text-center font-[Pretendard] text-[17px] not-italic font-medium leading-[28px]">
                        {text}
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default WideAcceptButton;