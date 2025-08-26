import type { GetScheduleDetailResponse } from "@/api/Api";
import { getDetailScheduleApi } from "@/apis/calendar";
import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import WideAcceptButton from "@/components/WideAcceptButton";
import { useEffect, useState } from "react";
import { dummySchedule } from "../constants";

interface CreateScheduleDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scheduleId?: number
}

const emptyData: GetScheduleDetailResponse = {
    title: "",
    scheduleType: undefined,
    startDateTime: "",
    endDateTime: "",
}

export const CreateScheduleDialog = ({ isOpen, setIsOpen, scheduleId }: CreateScheduleDialogProps) => {
    const [data, setData] = useState<GetScheduleDetailResponse>(emptyData);
    const [title, setTitle] = useState(data.title);
    const [scheduleType, setScheduleType] = useState(data.scheduleType)
    const [content, setContent] = useState(data.content);
    const [startDateTime, setStartDateTime] = useState(data.startDateTime);
    const [endDateTime, setEndDateTime] = useState(data.endDateTime);

    const [schedule, setSchedule] = useState<GetScheduleDetailResponse>(emptyData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // e.target에서 name과 value를 추출합니다.
    // input 태그에 name 속성을 꼭 추가해야 합니다.
    const { name, value } = e.target;

    setSchedule(prevSchedule => ({
        ...prevSchedule, // 👈 기존 schedule 객체의 모든 속성을 그대로 복사하고
        [name]: value     // 👈 변경이 필요한 속성의 값만 새로 덮어씁니다. (ES6 Computed Property Names)
    }));
};

    useEffect(() => {
        const process = async () => {
            try {
                if (scheduleId !== undefined) {
                    if (scheduleId === 0) {
                        console.log("생성용 id로 접속")
                        setData(emptyData);
                    }
                    else {
                        const result = await getDetailScheduleApi(scheduleId);
                        setData(result ?? emptyData);
                    }
                }
                else {
                    console.error("입력받은 scheduleId가 undefined. scheduleId : ", scheduleId);
                }
            } catch (error) {
                console.error(error);
                console.log("스케쥴 상세 조회 더미 데이터 로드")
                setTitle(dummySchedule.title);
                setScheduleType(dummySchedule.scheduleType);
                setContent(dummySchedule.content);
                setStartDateTime(dummySchedule.startDateTime);
                setEndDateTime(dummySchedule.endDateTime);
            } finally {
                console.log("CalendarPage api finally")
            }
        }
        process();

    }, [scheduleId])

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
                        <input className="text-black-1 text-base font-medium leading-loose"
                            value={title} placeholder="일정의 제목을 입력해주세요."
                            onChange={(e) => setTitle(e.target.value)} />
                    </span>

                    <span className="flex gap-5 items-center">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            타입
                        </span>
                        <div>
                            <input type="radio" name="type" className=""  checked={scheduleType === "NORMAL"}
                                onChange={() => setScheduleType("NORMAL")} />
                            <label htmlFor="일반"> 일반 </label>
                        </div>
                        <span>
                            <input type="radio" name="type" className="" checked={scheduleType === "EXTRACURRICULAR"}
                                onChange={() => setScheduleType("EXTRACURRICULAR")} />
                            <label htmlFor="비교과"> 비교과 </label>
                        </span>

                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            설명
                        </span>
                        <input className="text-black-1 text-base font-medium leading-loose" value={content}
                            onChange={(e) => setContent(e.target.value)} />
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            시작 시간
                        </span>
                        <input type="datetime-local" className="text-black-1 text-[14px] font-medium leading-loose" value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)} />

                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            종료 시간
                        </span>
                        <input type="datetime-local" className="text-black-1 text-[14px] font-medium leading-loose" value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)} />
                    </span>
                </div>

                <DialogFooter className="flex items-center justify-center">
                    <WideAcceptButton text={"추가 / 수정"} isClickable={true} handleClick={() => setIsOpen(false)} />
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}