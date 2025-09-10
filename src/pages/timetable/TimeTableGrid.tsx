import { useEffect, useState } from "react";
import {
  useAddTimeTableStore,
  useSelectCellStore,
  useLoadTableStore,
} from "../../store/store";

import { getTimeTable } from "../../apis/timetable";
import type { dayString, Event } from "@/types/timetable-types";

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
const timeToGridRow = (time: number[]) => {
    const hour = time[0]; //14
    const minute = time[1]; //00
    return (hour - 9) * 2 + (minute === 30 ? 1 : 0) + 1;
};

const formatTime = (time: number[]) => {
    if(time[1] === 0)
        return `${time[0]}:${time[1]}0`;
    return `${time[0]}:${time[1]}`;
//   return time[0].toString() + ":" + time[1].toString();
};
const formatHour = (time: string) => `${parseInt(time.substring(0, 2), 10)}시`;

const TimeTableGrid = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { isEditing } = useAddTimeTableStore();
  const { selectedCell, setSelectedCell } = useSelectCellStore();
  const { loadTable, setLoadTable } = useLoadTableStore();

  const loadTimeTable = async () => {
    try {
      const tableData = await getTimeTable();
      console.log("시간표 불러오기 성공 : ", tableData);
      setLoadTable(tableData);
      console.log("현재 렌더링할 이벤트 목록", loadTable);
      return tableData;
    } catch (error) {
      console.error("시간표 불러오기 실패", error);
      return error;
    }
  };

  const checkIsSelect = (halfHour: string, day: dayString) => {
    return selectedCell.some((c) => c.startTime === halfHour && c.day === day);
  };

  const handleVoidClick = (
    startTime: string,
    endTime: string,
    day: dayString
  ) => {
    if (isEditing) {
      console.log(`선택된 셀 : ${startTime}/${day}`);

      const cell = {
        startTime: startTime,
        endTime: endTime,
        day: day,
      };

      if (checkIsSelect(startTime, day)) {
        const removedCell = selectedCell.filter(
          (c) => !(c.startTime === cell.startTime && c.day === cell.day)
        );
        setSelectedCell(removedCell);
      } else {
        setSelectedCell([...selectedCell, cell]);
      }
    } else {
      return;
    }
  };

  const handleEventClick = (event: Event) => {
    // const handleEventClick = (eventId: string) => {
    setSelectedEventId((prevId) => (prevId === event.id ? null : event.id));
    if (isEditing) {
      console.log(`선택된 셀 : ${event.startTime}/${event.day}`);
      const cell = {
        startTime: event.startTime,
        endTime: event.endTime,
        day: event.day,
      };
      if (checkIsSelect(event.startTime, event.day)) {
        const removedCell = selectedCell.filter(
          (c) => !(c.startTime === cell.startTime && c.day === cell.day)
        );
        setSelectedCell(removedCell);
      } else {
        setSelectedCell([...selectedCell, cell]);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    loadTimeTable();
  }, []);

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
      {/* #D9D9D9 */}
      {/* --- 1. 배경 그리드 셀 렌더링 --- */}
      {TIME_SLOTS.map((time, rowIndex) =>
        Object.keys(DAY_TO_COL).map((day, colIndex) => (
          <div
            key={`${time}-${day}`}
            onClick={() => {
              console.log(day);
              handleVoidClick(time, TIME_SLOTS[rowIndex + 1], day as dayString);
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
      {loadTable.map((event) => {
        // {events.map((event) => {
        const gridRowStart = timeToGridRow(event.startTime);
        const gridRowEnd = timeToGridRow(event.endTime);
        const gridColumn = DAY_TO_COL[event.day];
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
            <div className="flex-grow">
              <p className="font-bold text-[10px]">{event.eventName}</p>
              <p className="text-[8px]">{event.eventDetail}</p>
            </div>
            <div className="text-right text-xs mt-auto">
              {formatTime(event.endTime)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeTableGrid;
