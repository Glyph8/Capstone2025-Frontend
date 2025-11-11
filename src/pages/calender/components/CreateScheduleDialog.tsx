import {
  createScheduleApi,
  deleteDetailScheduleApi,
  getDetailScheduleApi,
  getExtraCurriApi,
  patchScheduleApi,
} from "@/apis/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import WideAcceptButton from "@/components/WideAcceptButton";
import { useEffect, useState } from "react";
import type {
  ExtracurricularResponse,
  GetScheduleDetailResponse,
} from "@/generated-api/Api";
import { formatKoreanDateTimeNative } from "@/utils/date";
import { Trash } from "lucide-react";

interface CreateScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId?: number;
  onSuccess: () => void;
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
  onSuccess,
}: CreateScheduleDialogProps) => {
  const [data, setData] = useState<GetScheduleDetailResponse>(emptyData);
  const [title, setTitle] = useState<string>(data.title ?? "");
  const [scheduleType, setScheduleType] = useState(data.scheduleType);
  const [content, setContent] = useState("");
  const [startDateTime, setStartDateTime] = useState(data.startDateTime);
  const [endDateTime, setEndDateTime] = useState(data.endDateTime);
  const [extraCurriID, setExtraCurriID] = useState<string | null>(
    data.extracurricularField?.originTitle ?? null
  );
  const [extraQuery, setExtraQuery] = useState("");
  const [extraCurri, setExtraCurri] = useState<
    ExtracurricularResponse[] | undefined
  >([]);

  const handlePostSchedule = async () => {
    const newEvent = {
      title: title,
      scheduleType: extraCurriID,
      content: content,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };

    console.log("입력 : ", newEvent.title);

    if (scheduleId === 0) {
      const res = await createScheduleApi(newEvent);
      if (res) {
        console.log("일정 추가 성공");
        onSuccess();
      } else {
        console.log("일정 추가 실패, 입력 : ", newEvent.title);
      }
      setIsOpen(false);
    } else {
      const res = await patchScheduleApi({
        ...newEvent,
        scheduleId: scheduleId!,
      });
      if (res) {
        console.log("일정 수정 성공");
        onSuccess();
      } else {
        console.log("일정 수정 실패, 입력 : ", newEvent.title);
      }
      setIsOpen(false);
    }
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
            console.log("이미 존재하는 일정 세부 조회", result);
            setData(result ?? emptyData);
            setTitle(data.title ?? "");
            setScheduleType(data.scheduleType);
            setContent(data.content ?? "");
            setStartDateTime(data.startDateTime);
            setEndDateTime(data.endDateTime);
          }
        } else {
          console.error(
            "입력받은 scheduleId가 undefined. scheduleId : ",
            scheduleId
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    process();
  }, [
    data.content,
    data.endDateTime,
    data.scheduleType,
    data.startDateTime,
    data.title,
    scheduleId,
  ]);

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
              className="flex-1 text-black-1 text-base font-medium leading-loose overflow-auto"
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
          {scheduleType === "EXTRACURRICULAR" && (
            <>
              <div className="flex gap-5">
                <span>비교과 검색</span>
                <input
                  type="text"
                  placeholder="비교과 이름 검색"
                  value={extraQuery}
                  onChange={(e) => setExtraQuery(e.target.value)}
                />
                <button
                  className="bg-[#01A862] px-2 rounded-2xl text-white whitespace-nowrap"
                  onClick={async () => {
                    const result = await getExtraCurriApi(extraQuery);
                    setExtraCurri(result?.data);
                  }}
                >
                  검색
                </button>
              </div>
              
              <ul className="flex flex-col gap-3 max-h-60 overflow-auto">
                {(extraCurri ?? []).map((item) => (
                  <li
                    style={{borderColor: `${item.id?.toString() === extraCurriID ?'#01A862' : 'white'}`}}
                    className="bg-white flex flex-col gap-2 border-1 border-white rounded-2xl p-1"
                    key={item.id}
                    onClick={() => {
                      if (item.id) {
                        setExtraCurriID(item.id?.toString());
                        setTitle(item.title ?? '')
                        setContent(item.url ?? '')
                        setStartDateTime(item.activityStart)
                        setEndDateTime(item.activityEnd);
                      };
                    }}
                  >
                    <span className="font-bold">{item.title}</span>
                    <span>
                      {formatKoreanDateTimeNative(item.activityStart)}~
                      {formatKoreanDateTimeNative(item.activityEnd)}
                    </span>
                    <span>
                      {formatKoreanDateTimeNative(item.applicationStart)}~
                      {formatKoreanDateTimeNative(item.applicationEnd)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div></div>

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

        <DialogFooter className="flex items-center justify-center relative">
          <WideAcceptButton
            text={"추가 / 수정"}
            isClickable={true}
            handleClick={handlePostSchedule}
          />
          <button className="absolute right-2"
          onClick={()=>{
            if(scheduleId)
              deleteDetailScheduleApi(scheduleId)
              setIsOpen(false);
              onSuccess();
          }}>
            <Trash/>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
