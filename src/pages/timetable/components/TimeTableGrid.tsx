import { useEffect, useState, useRef } from "react";
import {
  useAddTimeTableStore,
  useSelectCellStore,
  useLoadTableStore,
} from "../../../store/store";

import { deleteEvent, getTimeTable, patchEvent } from "../../../apis/timetable"; // patchEvent 추가
import type { dayString } from "@/types/timetable-types";
import type {
  ChangeTimetableRequest,
  LocalTime,
  LookupTimetableResponse,
} from "@/generated-api/Api";
import {
  formatLocalTime,
  parseFormattedTimeToLocalTime,
  timeToMinutes,
} from "@/utils/timetableUtils";
import EditTableDrawer from "./EditTableDrawer";
import toast from "react-hot-toast";

// --- 헬퍼 상수 및 함수 ---
const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const hour = String(Math.floor(i / 2) + 9).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}${minute}`;
});
const DAY_TO_COL = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };

const timeToGridRow = (time: LocalTime | undefined): number => {
  const hour = time?.hour ?? 9;
  const minute = time?.minute ?? 0;
  return (hour - 9) * 2 + (minute === 30 ? 1 : 0) + 1;
};

const formatToHourMinute = (timeString: string | undefined | null): string => {
  if (!timeString) return "";
  try {
    const [hourStr, minuteStr] = timeString.split(":");
    return `${parseInt(hourStr, 10)}:${minuteStr}`;
  } catch (error) {
    return "";
  }
};
const formatHour = (time: string) => `${parseInt(time.substring(0, 2), 10)}시`;
const hhmmStringToLocalTime = (timeString: string): LocalTime => {
  const hour = parseInt(timeString.substring(0, 2), 10);
  const minute = parseInt(timeString.substring(2, 4), 10);
  return { hour, minute };
};

// 분 단위를 LocalTime 객체로 변환하는 헬퍼
const minutesToLocalTime = (totalMinutes: number): LocalTime => {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return { hour, minute };
};

const TimeTableGrid = () => {
  const [selectedEventId, setSelectedEventId] = useState<
    number | null | undefined
  >(null);
  const { isEditing, setIsEditing } = useAddTimeTableStore();
  const { selectedCell, clearCells, setCells, setSelectedExistingEvent } =
    useSelectCellStore();
  const { loadTable, setLoadTable } = useLoadTableStore();

  // --- 드래그 상태 관리 ---
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 모드: 'create'(빈칸 드래그) 또는 'move'(이벤트 이동)
  const [dragMode, setDragMode] = useState<"create" | "move" | null>(null);

  // 생성 모드용 상태
  const [dragStartInfo, setDragStartInfo] = useState<{
    day: dayString;
    index: number;
  } | null>(null);

  // 이동 모드용 상태
  const [movingEvent, setMovingEvent] =
    useState<LookupTimetableResponse | null>(null); // 현재 잡고 있는 이벤트
  const [moveTarget, setMoveTarget] = useState<{
    day: dayString;
    index: number;
  } | null>(null); // 놓을 위치
  const [eventDuration, setEventDuration] = useState<number>(0); // 이벤트 길이(분)

  const dragEndIndexRef = useRef<number | null>(null);

  const loadTimeTable = async () => {
    try {
      const tableData = await getTimeTable();
      setLoadTable(tableData || []);
    } catch (error) {
      console.error("시간표 불러오기 실패", error);
    }
  };

  useEffect(() => {
    loadTimeTable();
  }, [selectedCell]); // selectedCell 변경 시 갱신보다는, 저장 완료 후 호출됨

  // --- 범위 선택 (Create Mode Logic) ---
  const selectRange = (
    day: dayString,
    startIndex: number,
    endIndex: number
  ) => {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const newCells = [];

    for (let i = start; i <= end; i++) {
      if (i >= TIME_SLOTS.length - 1) continue;
      newCells.push({
        day: day,
        startTime: hhmmStringToLocalTime(TIME_SLOTS[i]),
        endTime: hhmmStringToLocalTime(TIME_SLOTS[i + 1]),
      });
    }
    setCells(newCells);
  };

  // --------------------------------------------------------
  // 핸들러 통합 (Mouse & Touch)
  // --------------------------------------------------------

  // 1. [Create] 빈 셀에서 시작
  const handleCellStart = (day: dayString, timeIndex: number) => {
    setDragMode("create");
    setIsDragging(true);
    setDragStartInfo({ day, index: timeIndex });
    dragEndIndexRef.current = timeIndex;
    clearCells();
    selectRange(day, timeIndex, timeIndex);
  };

  // 2. [Move] 기존 이벤트에서 시작 (stopPropagation 중요)
  const handleEventDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    event: LookupTimetableResponse
  ) => {
    e.stopPropagation(); // 빈 셀 클릭 이벤트 전파 방지

    // 시간 계산: 현재 이벤트가 몇 분짜리인지?
    const startMin = timeToMinutes(
      parseFormattedTimeToLocalTime(event.startTime as string)
    );
    const endMin = timeToMinutes(
      parseFormattedTimeToLocalTime(event.endTime as string)
    );
    const duration = endMin - startMin;

    setDragMode("move");
    setIsDragging(true);
    setMovingEvent(event);
    setEventDuration(duration);

    // 초기 타겟 설정 (원래 있던 자리)
    if (event.day) {
      // 원래 시작 시간의 인덱스 찾기
      // const startIndex = TIME_SLOTS.findIndex((t) =>
      //   t.startsWith(String(startMin / 60).padStart(2, "0"))
      // );

      const parsedStartTime = parseFormattedTimeToLocalTime(
        event.startTime as string
      );
      const startH = parsedStartTime ? parsedStartTime.hour : 0;
      const startM = parsedStartTime ? parsedStartTime.minute : 0;
      const timeStr = `${String(startH).padStart(2, "0")}${
        startM === 0 ? "00" : "30"
      }`;
      const idx = TIME_SLOTS.indexOf(timeStr);

      if (idx !== -1) {
        setMoveTarget({ day: event.day as dayString, index: idx });
      }
    }
  };

  const handleMoveUpdate = (day: dayString, timeIndex: number) => {
    if (!isDragging) return;

    if (dragMode === "create") {
      if (!dragStartInfo) return;
      if (day !== dragStartInfo.day) return;
      if (dragEndIndexRef.current === timeIndex) return;
      dragEndIndexRef.current = timeIndex;
      selectRange(dragStartInfo.day, dragStartInfo.index, timeIndex);
    } else if (dragMode === "move") {
      if (moveTarget?.day !== day || moveTarget?.index !== timeIndex) {
        setMoveTarget({ day, index: timeIndex });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element) {
      const day = element.getAttribute("data-day") as dayString | null;
      const indexStr = element.getAttribute("data-index");

      if (day && indexStr) {
        const index = parseInt(indexStr, 10);
        handleMoveUpdate(day, index);
      }
    }
  };

  const handleEnd = async () => {
    if (!isDragging) return;

    if (dragMode === "create") {
      setIsEditing(true);
    } else if (
      dragMode === "move" &&
      movingEvent &&
      moveTarget &&
      eventDuration > 0
    ) {
      const newStartLocalTime = hhmmStringToLocalTime(
        TIME_SLOTS[moveTarget.index]
      );
      const newStartMin = timeToMinutes(newStartLocalTime);

      const newEndMin = newStartMin + eventDuration;
      const newEndLocalTime = minutesToLocalTime(newEndMin);

      const changedEvent = {
        id: movingEvent.id,
        day: moveTarget.day, // 바뀐 요일
        startTime: formatLocalTime(newStartLocalTime),
        endTime: formatLocalTime(newEndLocalTime),
        eventName: movingEvent.eventName,
        eventDetail: movingEvent.eventDetail,
        color: movingEvent.color,
      };

      try {
        const success = await patchEvent(
          changedEvent as ChangeTimetableRequest
        );
        if (success) {
          toast.success("이동 성공");
          loadTimeTable(); // 성공 시 테이블 다시 로드
        } else {
          alert("시간표 이동에 실패했습니다.");
        }
      } catch (e) {
        console.error(e);
        alert("시간표 이동 중 오류가 발생했습니다.");
      }
    }

    // 상태 초기화
    setIsDragging(false);
    setDragMode(null);
    setDragStartInfo(null);
    setMovingEvent(null);
    setMoveTarget(null);
    setEventDuration(0);
    dragEndIndexRef.current = null;
  };

  // 기존 이벤트 클릭 (수정/삭제 모드)
  const handleEventClick = (event: LookupTimetableResponse) => {
    // 드래그 후 클릭 이벤트가 발생할 수 있으므로 방어
    if (isDragging) return;

    setSelectedExistingEvent(event);
    if (event.day && event.startTime && event.endTime) {
      const start = parseFormattedTimeToLocalTime(event.startTime as string);
      const end = parseFormattedTimeToLocalTime(event.endTime as string);
      setCells([{ day: event.day, startTime: start, endTime: end }]);
    }
    setIsEditing(true);
  };

  return (
    <div className="relative pb-64">
      <EditTableDrawer fetchTable={loadTimeTable} />

      <div
        className="grid select-none"
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchEnd={handleEnd}
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridTemplateRows: `repeat(${TIME_SLOTS.length}, 80px)`,
          gap: "1.5px",
          backgroundColor: "#D7D7D9",
          touchAction: "none",
        }}
      >
        {/* --- 1. 배경 그리드 --- */}
        {TIME_SLOTS.map((time, rowIndex) => {
          if (rowIndex === TIME_SLOTS.length - 1) return null;

          return Object.keys(DAY_TO_COL).map((day, colIndex) => (
            <div
              key={`${time}-${day}`}
              data-day={day}
              data-index={rowIndex}
              // 생성 모드 시작
              onMouseDown={() => handleCellStart(day as dayString, rowIndex)}
              onMouseEnter={() => handleMoveUpdate(day as dayString, rowIndex)}
              onTouchStart={() => handleCellStart(day as dayString, rowIndex)}
              onTouchMove={handleTouchMove}
              style={{
                backgroundColor: "#f5f5f5",
                gridRow: rowIndex + 1,
                gridColumn: colIndex + 1,
                cursor: dragMode === "move" ? "grabbing" : "pointer",
              }}
            ></div>
          ));
        })}

        {/* --- 2. 라벨 --- */}
        {TIME_SLOTS.map((time, rowIndex) => {
          if (time.endsWith("00")) {
            return (
              <div
                key={`label-${time}`}
                className="relative text-xs text-gray-500 pointer-events-none"
                style={{ gridRow: rowIndex + 1, gridColumn: 1 }}
              >
                <span className="absolute top-0 left-1">
                  {formatHour(time)}
                </span>
              </div>
            );
          }
          return null;
        })}

        {/* --- 3. 기존 이벤트 --- */}
        {loadTable.map((event) => {
          if (!event.day || !(event.day in DAY_TO_COL)) return null;
          const gridRowStart = timeToGridRow(
            parseFormattedTimeToLocalTime(event.startTime as string)
          );
          const gridRowEnd = timeToGridRow(
            parseFormattedTimeToLocalTime(event.endTime as string)
          );
          const gridColumn = DAY_TO_COL[event.day as keyof typeof DAY_TO_COL];
          const isSelected = selectedEventId === event.id;

          // 현재 이동 중인 이벤트는 약간 투명하게 표시 (원래 위치 표시용)
          const isMovingThis =
            dragMode === "move" && movingEvent?.id === event.id;

          return (
            <div
              key={event.id}
              // [중요] 이벤트 위에서 마우스 누르면 이동 모드 시작
              onMouseDown={(e) => handleEventDragStart(e, event)}
              onTouchStart={(e) => handleEventDragStart(e, event)}
              // 클릭 시 수정 모드 (드래그가 아니었을 때만)
              onClick={(e) => {
                e.stopPropagation();
                // 아주 짧은 클릭이었을 때만 동작하도록 로직을 짤 수도 있으나,
                // 여기선 MouseUp에서 dragMode가 null로 풀리므로 괜찮음.
                // 단, handleEnd가 먼저 돌아서 isDragging이 false가 되어야 함.
                handleEventClick(event);
              }}
              className={`w-full overflow-hidden flex flex-col p-2 rounded-lg transition-all text-gray-800 
                ${
                  isMovingThis ? "opacity-30" : "hover:brightness-95"
                } cursor-grab active:cursor-grabbing`}
              style={{
                gridRow: `${gridRowStart} / ${gridRowEnd}`,
                gridColumn: gridColumn,
                backgroundColor: event.color,
                zIndex: isSelected ? 10 : 5,
              }}
            >
              <div className="flex-grow text-white pointer-events-none">
                {" "}
                {/* 내부 텍스트 선택 방지 */}
                <p className="font-bold text-[10px]">{event.eventName}</p>
                <p className="text-[8px]">{event.eventDetail}</p>
              </div>
            </div>
          );
        })}

        {/* --- 4. [Ghost UI] 이동 중인 이벤트 미리보기 --- */}
        {dragMode === "move" && moveTarget && movingEvent && (
          <div
            className="w-full rounded-lg pointer-events-none shadow-xl border-2 border-dashed border-white z-50 flex flex-col p-2"
            style={{
              gridColumn: DAY_TO_COL[moveTarget.day],
              gridRow: `${moveTarget.index + 1} / span ${Math.floor(
                eventDuration / 30
              )}`, // 시작 인덱스 ~ duration만큼 차지
              backgroundColor: movingEvent.color,
              opacity: 0.8,
            }}
          >
            <div className="flex-grow text-white">
              <p className="font-bold text-[10px]">{movingEvent.eventName}</p>
              <p className="text-[8px]">{movingEvent.eventDetail}</p>
              <p className="text-[8px] mt-1 font-bold">
                {formatHour(TIME_SLOTS[moveTarget.index])}으로 이동
              </p>
            </div>
          </div>
        )}

        {dragMode === "create" &&
          selectedCell.map((cell) => {
            if (!cell.day || !(cell.day in DAY_TO_COL)) return null;
            const gridRowStart = timeToGridRow(cell.startTime);
            const gridRowEnd = timeToGridRow(cell.endTime);
            const gridColumn = DAY_TO_COL[cell.day as keyof typeof DAY_TO_COL];
            return (
              <div
                key={`selected-${cell.day}-${timeToMinutes(cell.startTime)}`}
                className="w-full rounded-lg pointer-events-none animate-pulse"
                style={{
                  gridRow: `${gridRowStart} / ${gridRowEnd}`,
                  gridColumn: gridColumn,
                  backgroundColor: "rgba(59, 130, 246, 0.5)",
                  zIndex: 2,
                  border: "1px solid #2563EB",
                }}
              ></div>
            );
          })}
      </div>
    </div>
  );
};

export default TimeTableGrid;
