import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import WideAcceptButton from "@/components/WideAcceptButton";
import type { CalendarData } from "@/types/calendar-types";
import { useEffect, useState } from "react";

interface CreateScheduleDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scheduleId: number
}

const emptyData:CalendarData= {
    scheduleId: -1,
    title: "",
    scheduleType: "",
    startDate: "",
    endDate: "",
}

export const CreateScheduleDialog = ({ isOpen, setIsOpen, scheduleId}: CreateScheduleDialogProps) => {
    const [data, setData] = useState(emptyData);
    useEffect(()=>{
        
    }, [])
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                상세 일정
            </DialogTitle>
            <DialogContent
                className="w-full p-5 bg-[#E9E9EB]">

                <div className="flex flex-col justify-center items-start gap-3">
                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            제목
                        </span>
                        <input className="text-black-1 text-base font-medium leading-loose" value={data.title} placeholder="123123123" />
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            설명
                        </span>
                        <input className="text-black-1 text-base font-medium leading-loose" value={data.content} />
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            시작 시간
                        </span>
                        <input className="text-black-1 text-base font-medium leading-loose" value={data.startDate} />

                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            종료 시간
                        </span>
                        <input className="text-black-1 text-base font-medium leading-loose" value={data.endDate} />

                    </span>
                </div>

                <DialogFooter>
                    <WideAcceptButton text={"추가 / 수정"} isClickable={true} handleClick={() => setIsOpen(false)} />
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}