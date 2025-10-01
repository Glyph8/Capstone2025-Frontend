import { useEffect, useState} from "react";
import {
  useAddTimeTableStore,
  useSelectCellStore,
  useLoadTableStore,
} from "../../../store/store";

import { deleteEvent, getTimeTable } from "../../../apis/timetable";
import type { dayString } from "@/types/timetable-types";
import type { LocalTime, LookupTimetableResponse } from "@/generated-api/Api";
import {
  parseFormattedTimeToLocalTime,
  timeToMinutes,
} from "@/utils/timetableUtils";
import EditTableDrawer from "./EditTableDrawer";

// --- 헬퍼 상수 및 함수 ---
const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  // 09:00 ~ 22:30 까지 30분 단위 슬롯
  const hour = String(Math.floor(i / 2) + 9).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}${minute}`;
});
const DAY_TO_COL = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };

/*
 * 이벤트 시간 <-> Grid Row 변환 로직 검토 및 확정
 * CSS Grid 라인은 1부터 시작합니다.
 * 09:00는 1번 라인에서 시작, 09:30은 2번 라인에서 시작...
 * endTime은 해당 시간의 시작 라인을 가리킵니다.
 * 예: 09:00 ~ 10:30 이벤트는 1번 라인에서 시작하여 4번 라인(10:30 시작) 직전까지 차지합니다. (grid-row: 1 / 4)
 */
//1400
const timeToGridRow = (time: LocalTime | undefined): number => {
  // time이 undefined이면 time.hour는 undefined가 되고, ?? 연산자가 9를 기본값으로 사용
  const hour = time?.hour ?? 9;
  const minute = time?.minute ?? 0;

  return (hour - 9) * 2 + (minute === 30 ? 1 : 0) + 1;
};

const formatToHourMinute = (timeString: string | undefined | null): string => {
  // 1. 입력값이 없으면 빈 문자열을 반환합니다.
  if (!timeString) {
    return "";
  }

  try {
    // 2. ":"를 기준으로 문자열을 자릅니다.
    // "09:30:00.000000" -> ["09", "30", "00.000000"]
    const [hourStr, minuteStr] = timeString.split(":");

    // 3. 시간(hour) 부분의 앞에 붙은 '0'을 제거하기 위해 숫자로 변환합니다.
    const hour = parseInt(hourStr, 10);

    // 4. 변환 중 오류가 발생했는지 확인합니다.
    if (isNaN(hour) || minuteStr === undefined) {
      return "";
    }

    // 5. "시간:분" 형태로 조합하여 반환합니다. (예: "9:30")
    return `${hour}:${minuteStr}`;
  } catch (error) {
    console.error("잘못된 형식의 시간 문자열입니다:", timeString, error);
    return "";
  }
};
const formatHour = (time: string) => `${parseInt(time.substring(0, 2), 10)}시`;

const TimeTableGrid = () => {
  const [selectedEventId, setSelectedEventId] = useState<
    number | null | undefined
  >(null);
  const { isEditing} = useAddTimeTableStore();
  const { selectedCell, updateCell } = useSelectCellStore();
  const { loadTable, setLoadTable } = useLoadTableStore();

  const loadTimeTable = async () => {
    try {
      const tableData = await getTimeTable();
      console.log("시간표 불러오기 성공 : ", tableData);
      setLoadTable(tableData || []);
      console.log("현재 렌더링할 이벤트 목록", loadTable);
    } catch (error) {
      console.error("시간표 불러오기 실패", error);
      return error;
    }
  };

  const hhmmStringToLocalTime = (timeString: string): LocalTime => {
    // 1. 문자열을 2글자씩 자릅니다.
    const hourStr = timeString.substring(0, 2); // 0번째부터 2번째 직전까지 -> "12"
    const minuteStr = timeString.substring(2, 4); // 2번째부터 4번째 직전까지 -> "30"

    // 2. 잘라낸 문자열을 숫자로 변환합니다.
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // 3. LocalTime 객체로 반환합니다.
    return { hour: hour, minute: minute };
  };

  const handleVoidClick = (
    startTime: LocalTime,
    endTime: LocalTime,
    day: dayString
  ) => {
    if (isEditing) {
      console.log(`선택된 셀 : ${startTime}/${day}`);

      const cell = {
        startTime: startTime,
        endTime: endTime,
        day: day,
      };
      updateCell(cell);
    } else {
      return;
    }
  };

  const handleEventClick = (event: LookupTimetableResponse) => {
    // const handleEventClick = (eventId: string) => {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id));
    if (isEditing) {
      console.log(`선택된 셀 : ${event.startTime}/${event.day}`);
      const cell = {
        startTime: event.startTime,
        endTime: event.endTime,
        day: event.day,
      };
      if (event.id) 
        deleteEvent(event.id);
      loadTimeTable();
      // 지우는 로직 추가
      // if (checkIsSelect(event.startTime, event.day)) {
      //   const removedCell = selectedCell.filter(
      //     (c) => !(c.startTime === cell.startTime && c.day === cell.day)
      //   );
      //   setSelectedCell(removedCell);
      // } else {
      //   setSelectedCell([...selectedCell, cell]);
      // }
    } else {
      return;
    }
  };

  useEffect(() => {
    loadTimeTable();
  }, [selectedCell]);

  useEffect(() => {
    console.log("상태 업데이트 후 렌더링된 이벤트 목록", loadTable);
    // 이 곳에서 loadTable을 사용하는 다른 로직을 수행할 수 있습니다.
  }, [loadTable]); // loadTable이 바뀔 때마다 실행

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        // 30분 단위로 28개의 행을 생성
        gridTemplateRows: `repeat(${TIME_SLOTS.length}, 80px)`,
        // 그리드 라인 사이에 미세한 간격 추가
        gap: "1.5px",
        backgroundColor: "#D7D7D9", // 간격 색상
      }}
    >


      {/* <EditTableDrawer fetchTable={loadTimeTable}/> */}


      {/* #D9D9D9 */}
      {/* --- 1. 배경 그리드 셀 렌더링 --- */}
      {TIME_SLOTS.map((time, rowIndex) =>
        Object.keys(DAY_TO_COL).map((day, colIndex) => (
          <div
            key={`${time}-${day}`}
            onClick={() => {
              console.log(day);
              handleVoidClick(
                hhmmStringToLocalTime(time),
                hhmmStringToLocalTime(TIME_SLOTS[rowIndex + 1]),
                day as dayString
              );
              // handleVoidClick(time, TIME_SLOTS[rowIndex + 1], day as dayString);
            }}
            style={{
              backgroundColor: "#f5f5f5",
              gridRow: rowIndex + 1,
              gridColumn: colIndex + 1,
            }}
          ></div>
        ))
      )}

      {/* --- 2. 월요일(MON)에 시간 라벨 렌더링 --- */}
      {TIME_SLOTS.map((time, rowIndex) => {
        // 정시(00분)인 경우에만 라벨을 표시
        if (time.endsWith("00")) {
          return (
            <div
              key={`label-${time}`}
              className="relative text-xs text-gray-500 pointer-events-none"
              style={{
                gridRow: rowIndex + 1,
                gridColumn: 1, // 항상 월요일 컬럼에 위치
              }}
            >
              <span className="absolute top-0 left-1">{formatHour(time)}</span>
            </div>
          );
        }
        return null;
      })}

      {/* --- 3. 이벤트 블록 렌더링 --- */}
      {loadTable.map((event: LookupTimetableResponse) => {
        // {events.map((event) => {
        if (!event.day || !(event.day in DAY_TO_COL)) {
          return null;
        }
        // 아오.. 왜 LocalTime 타입으로 생성되는지..
        const gridRowStart = timeToGridRow(
          parseFormattedTimeToLocalTime(event.startTime as string)
        );
        const gridRowEnd = timeToGridRow(
          parseFormattedTimeToLocalTime(event.endTime as string)
        );
        const gridColumn = DAY_TO_COL[event.day as keyof typeof DAY_TO_COL];
        const isSelected = selectedEventId === event.id;
        return (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            // onClick={() => handleEventClick(event.id)}
            className="w-full overflow-clip flex flex-col p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-800"
            style={{
              gridRow: `${gridRowStart} / ${gridRowEnd}`,
              gridColumn: gridColumn,
              backgroundColor: event.color,
              boxShadow: isSelected
                ? "0 0 0 2px #3B82F6"
                : "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              zIndex: isSelected ? 2 : 1, // 선택된 셀을 위로
            }}
          >
            <div className="flex-grow text-white">
              {/* <p>id : {event.id}</p> */}
              <p className="font-bold text-[10px]">{event.eventName}</p>
              <p className="text-[8px]">{event.eventDetail}</p>
            </div>
            <div className="flex flex-col text-right text-[8px] mt-auto text-white">
              <p>{formatToHourMinute(event.startTime as string)}</p>
              <p>{formatToHourMinute(event.endTime as string)}</p>
            </div>
          </div>
        );
      })}

      {/* 체크한 셀 표시 */}
      {selectedCell.map((cell) => {
        if (!cell.day || !(cell.day in DAY_TO_COL)) {
          return null;
        }
        const gridRowStart = timeToGridRow(cell.startTime);
        const gridRowEnd = timeToGridRow(cell.endTime);
        const gridColumn = DAY_TO_COL[cell.day as keyof typeof DAY_TO_COL];

        return (
          <div
            // selectedCell에는 고유 id가 없을 수 있으므로, 인덱스나 다른 고유값으로 key를 설정
            key={`selected-${cell.day}-${timeToMinutes(cell.startTime)}`}
            className="w-full rounded-lg pointer-events-none" // 클릭 이벤트를 막아 배경 셀이 클릭되도록 함
            style={{
              gridRow: `${gridRowStart} / ${gridRowEnd}`,
              gridColumn: gridColumn,
              backgroundColor: "rgba(59, 130, 246, 0.3)", // 반투명 파란색 배경
              zIndex: 0, // 이벤트(z-index: 1)보다 아래에 위치
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default TimeTableGrid;
