const TimeTableLabel = () => {

    return (
        <div className="w-full h-8 flex justify-around items-center pt-8 pl-4 pr-4 pb-6">
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-On-Brand text-base font-normal font-['Inter'] leading-none">월</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">화</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">수</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">목</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">금</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">토</div>
            </div>
            <div className="p-2 bg-[#F5F5F5] rounded-lg flex justify-center items-center gap-2">
                <div className="justify-center text-Text-Brand-Tertiary text-base font-normal font-['Inter'] leading-none">일</div>
            </div>
        </div>
    )
}

export default TimeTableLabel