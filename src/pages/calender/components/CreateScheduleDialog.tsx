import { createScheduleApi, getDetailScheduleApi } from "@/apis/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import WideAcceptButton from "@/components/WideAcceptButton";
import { useEffect, useState } from "react";
import type {
  GetScheduleDetailResponse,
} from "@/generated-api/Api";

interface CreateScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId?: number;
}

const emptyData: GetScheduleDetailResponse = {
  title: "",
  scheduleType: undefined,
  startDateTime: "",
  endDateTime: "",
};

export const CreateScheduleDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
}: CreateScheduleDialogProps) => {
  const [data, setData] = useState<GetScheduleDetailResponse>(emptyData);
  const [title, setTitle] = useState<string>("");
  const [scheduleType, setScheduleType] = useState(data.scheduleType);
  const [content, setContent] = useState("");
  const [startDateTime, setStartDateTime] = useState(data.startDateTime);
  const [endDateTime, setEndDateTime] = useState(data.endDateTime);

  const handlePostSchedule = async () => {

    const newEvent = {
      title: title,
      scheduleType: scheduleType,
      content: content,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };

    console.log("입력 : ", newEvent.title);
    const res = await createScheduleApi(newEvent);
    if (res) {
      console.log("일정 추가 성공");
    } else {
      console.log("일정 추가 실패, 입력 : ", newEvent.title);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const process = async () => {
      try {
        if (scheduleId !== undefined) {
          if (scheduleId === 0) {
            console.log("생성용 id로 접속");
            setData(emptyData);
          } else {
            const result = await getDetailScheduleApi(scheduleId);
            console.log("이미 존재하는 일정 세부 조회", result)
            setData(result ?? emptyData);
          }
        } else {
          console.error(
            "입력받은 scheduleId가 undefined. scheduleId : ",
            scheduleId
          );
        }
      } catch (error) {
        console.error(error);
        // setTitle(dummySchedule.title);
        // setScheduleType(dummySchedule.scheduleType);
        // setContent(dummySchedule.content);
        // setStartDateTime(dummySchedule.startDateTime);
        // setEndDateTime(dummySchedule.endDateTime);
      } finally {
        console.log("CalendarPage api finally");
      }
    };
    process();
  }, [scheduleId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>상세 일정</DialogTitle>
      <DialogContent className="w-full p-5 bg-[#E9E9EB]">
        <div className="flex flex-col justify-center items-start gap-3">
          <span className="flex gap-5">
            <span className="text-gray-2 text-base font-normal leading-loose">
              제목
            </span>
            <input
              className="text-black-1 text-base font-medium leading-loose"
              value={title}
              placeholder="일정의 제목을 입력해주세요."
              onChange={(e) => setTitle(e.target.value)}
            />
          </span>

          <span className="flex gap-5 items-center">
            <span className="text-gray-2 text-base font-normal leading-loose">
              타입
            </span>
            <div>
              <input
                type="radio"
                name="type"
                className=""
                checked={scheduleType === "NORMAL"}
                onChange={() => setScheduleType("NORMAL")}
              />
              <label htmlFor="일반"> 일반 </label>
            </div>
            <span>
              <input
                type="radio"
                name="type"
                className=""
                checked={scheduleType === "EXTRACURRICULAR"}
                onChange={() => setScheduleType("EXTRACURRICULAR")}
              />
              <label htmlFor="비교과"> 비교과 </label>
            </span>
          </span>

          <span className="flex gap-5">
            <span className="text-gray-2 text-base font-normal leading-loose">
              설명
            </span>
            <input
              className="text-black-1 text-base font-medium leading-loose"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </span>

          <span className="flex gap-5">
            <span className="text-gray-2 text-base font-normal leading-loose">
              시작 시간
            </span>
            <input
              type="datetime-local"
              className="text-black-1 text-[14px] font-medium leading-loose"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </span>

          <span className="flex gap-5">
            <span className="text-gray-2 text-base font-normal leading-loose">
              종료 시간
            </span>
            <input
              type="datetime-local"
              className="text-black-1 text-[14px] font-medium leading-loose"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
          </span>
        </div>

        <DialogFooter className="flex items-center justify-center">
          <WideAcceptButton
            text={"추가 / 수정"}
            isClickable={true}
            handleClick={() => handlePostSchedule}
          />
          <button onClick={handlePostSchedule}>
            추가
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
