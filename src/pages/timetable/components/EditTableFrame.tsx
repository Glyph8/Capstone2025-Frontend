// 스타벅스1 = #08AC64
// 스타벅스2 = #005B3F
// 좀덜흰색 = #FCFFFF

import { useSelectCellStore, usePresetStore } from "../../../store/store";
// import { sendEventRequest } from "../../apis/timetable";
import SelectedCell from "./SelectedCell";
import CellPreset from "./CellPreset";
import { useState } from "react";
import { sendEventRequest } from "../../../apis/timetable";
import type { AddTimeRequest, Preset } from "@/types/timetable-types";
import type { MakeMemberTimetableRequest } from "@/generated-api/Api";
import { getRandomDarkHexColor } from "@/utils/randomColorUtils";

const EditTableFrame = () => {
  const { selectedCell, clearCells } = useSelectCellStore();
  const { presets } = usePresetStore();
  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");

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
        startTime: cell.startTime,
        endTime: cell.endTime,
        eventName: eventName,
        eventDetail: eventDetail,
        color: color,
      };
      return eventItem as MakeMemberTimetableRequest;
    });
    sendEventRequest(sendEvent);
  };

  return (
    <div
      className="flex flex-col justify-between
        w-full h-96 pl-4 pr-4 bottom-0 absolute 
        bg-white rounded-tl-2xl rounded-tr-2xl 
        shadow-[0px_-0.05000000074505806px_1px_0px_rgba(0,0,0,0.25)] 
        overflow-hidden z-10"
    >
      {/* 선택한 셀 시간 정보 + 전체 취소 버튼 */}
      {selectedCell.length === 0 ? null : (
        <SelectedCell selectedCell={selectedCell} clearCells={clearCells} />
      )}

      <div className="flex flex-row justify-between items-center m-4 pt-2">
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
            console.log("임의 색상 : ",randomColor)
            const request = {
              selectedCell: selectedCell,
              eventName: eventName,
              eventDetail: eventDetail,
              color: "#005B3F",
            };
            addEvent(request);
          }}
        >
          <img src="/icons/plus-icon.svg" />
        </div>
      </div>

      {/* 시간표 프리셋 컴포넌트 */}
      {/* 클릭하여 이벤트 이름, 이벤트 설명, 색깔 불러오는 기능, 프리셋에서 제거 기능 추가 필요 */}

      <div
        className="flex flex-col justify-start items-center 
            w-full h-full bg-[#005B3F] rounded-tl-2xl rounded-tr-2xl pl-4 pr-4 overflow-y-scroll no-scrollbar"
      >
        {presets.map((preset: Preset) => {
          return <CellPreset preset={preset} />;
        })}
      </div>
    </div>
  );
};

export default EditTableFrame;
