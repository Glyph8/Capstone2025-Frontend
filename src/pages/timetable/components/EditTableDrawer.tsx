import { sendEventRequest } from "@/apis/timetable";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { MakeMemberTimetableRequest } from "@/generated-api/Api";
import {
  useSelectCellStore,
  usePresetStore,
  useAddTimeTableStore,
} from "@/store/store";
import type { AddTimeRequest, Preset } from "@/types/timetable-types";
import { getRandomDarkHexColor } from "@/utils/randomColorUtils";
import { formatLocalTime } from "@/utils/timetableUtils";
import { useState } from "react";
import SelectedCell from "./SelectedCell";
import CellPreset from "./CellPreset";
import { DialogTitle } from "@/components/ui/dialog";

interface EditTableDrawerProps {
  fetchTable: () => void;
}

export default function EditTableDrawer({ fetchTable }: EditTableDrawerProps) {
  const { selectedCell, clearCells } = useSelectCellStore();
  const { presets } = usePresetStore();
  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const { isEditing, setIsEditing } = useAddTimeTableStore();

  const addEvent = ({
    selectedCell,
    eventName,
    eventDetail,
    color,
  }: AddTimeRequest) => {
    // sendEventRequest(day)
    const sendEvent = selectedCell.map((cell: MakeMemberTimetableRequest) => {
      const eventItem = {
        // id: cell.day + '_' + cell.startTime,
        day: cell.day,
        startTime: formatLocalTime(cell.startTime),
        endTime: formatLocalTime(cell.endTime),
        eventName: eventName,
        eventDetail: eventDetail,
        color: color,
      };
      return eventItem as MakeMemberTimetableRequest;
    });
    sendEventRequest(sendEvent);
    fetchTable();
  };

  return (
    // <Drawer open={isEditing} onOpenChange={setIsEditing} modal={false}>
    <Drawer open={isEditing} onOpenChange={setIsEditing} dismissible={false}>
      <DrawerContent>
        <div className="px-5">
          {selectedCell.length === 0 ? null : (
            <SelectedCell selectedCell={selectedCell} clearCells={clearCells} />
          )}
          <DialogTitle></DialogTitle>
          <div className="flex flex-row justify-between items-center pt-2">
            <div className="flex flex-col w-full">
              <div className="w-[90%] h-6 text-left justify-start text-black text-xs font-light font-['Pretendard'] leading-7">
                활동명
              </div>
              <input
                className="w-[90%] text-black text-sm font-medium font-['Pretendard'] leading-7"
                onChange={(e) => {
                  setEventName(e.target.value);
                }}
                placeholder="예: 컴퓨터네트워크2"
              />

              {/* 입력 하단 초록줄 */}
              <div className="w-[90%] h-0 outline-1 outline-offset-[-0.50px] outline-emerald-600"></div>
            </div>

            <div className="flex flex-col w-full">
              <div className="w-[90%] h-6 text-left text-black text-xs font-light font-['Pretendard'] leading-7">
                활동 설명
              </div>
              <input
                className="w-[90%] text-black text-sm font-medium font-['Pretendard'] leading-7"
                onChange={(e) => {
                  setEventDetail(e.target.value);
                }}
                placeholder="예: 공C487"
              />
              <div className="w-[90%] h-0 outline-1 outline-offset-[-0.50px] outline-emerald-600"></div>
            </div>

            <div
              className="flex flex-col justify-center w-6 h-6"
              onClick={() => {
                // 연속하게 select된 셀들 단위로 반복 요청.
                // selectedCell, eventName, eventDetail, color
                const randomColor = getRandomDarkHexColor();
                console.log("임의 색상 : ", randomColor);
                const request = {
                  selectedCell: selectedCell,
                  eventName: eventName,
                  eventDetail: eventDetail,
                  color: randomColor,
                };
                addEvent(request);
              }}
            >
              <img src="/icons/plus-icon.svg" />
            </div>
          </div>

          <div
            className="flex flex-col justify-start items-center  mt-5
            w-full h-40 bg-[#005B3F] rounded-tl-2xl rounded-tr-2xl pl-4 pr-4 overflow-y-scroll no-scrollbar"
          >
            {presets.map((preset: Preset) => {
              return <CellPreset preset={preset} key={preset.id} />;
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
