import { useEffect, useState, useRef } from "react";
import {
  useAddTimeTableStore,
  useSelectCellStore,
  useLoadTableStore,
} from "../../../store/store";

import { deleteEvent, getTimeTable } from "../../../apis/timetable";
import type { dayString } from "@/types/timetable-types";
import type {
  LocalTime,
  LookupTimetableResponse,
  MakeMemberTimetableRequest,
} from "@/generated-api/Api";
import {
  parseFormattedTimeToLocalTime,
  timeToMinutes,
} from "@/utils/timetableUtils";
import EditTableDrawer from "./EditTableDrawer";

// --- 헬퍼 상수 ---
const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const hour = String(Math.floor(i / 2) + 9).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}${minute}`;
});
const DAY_TO_COL = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };

// --- 헬퍼 함수 ---
const timeToGridRow = (time: LocalTime | undefined): number => {
  const hour = time?.hour ?? 9;
  const minute = time?.minute ?? 0;
  return (hour - 9) * 2 + (minute === 30 ? 1 : 0) + 1;
};

const formatToHourMinute = (timeString: string | undefined | null): string => {
  if (!timeString) return "";
  try {
    const [hourStr, minuteStr] = timeString.split(":");
    // 안전한 파싱을 위해 NaN 체크 추가 권장
    const hour = parseInt(hourStr, 10);
    if (isNaN(hour) || !minuteStr) return "";
    return `${hour}:${minuteStr}`;
  } catch (error) {
    return `${error}`;
  }
};

const formatHour = (time: string) => `${parseInt(time.substring(0, 2), 10)}시`;

const hhmmStringToLocalTime = (timeString: string): LocalTime => {
  const hour = parseInt(timeString.substring(0, 2), 10);
  const minute = parseInt(timeString.substring(2, 4), 10);
  return { hour, minute };
};

const TimeTableGrid = () => {
  const [selectedEventId, setSelectedEventId] = useState<number | null | undefined>(null);
  const { isEditing, setIsEditing } = useAddTimeTableStore();
  const { selectedCell, clearCells, setCells } = useSelectCellStore();
  const { loadTable, setLoadTable } = useLoadTableStore();

  // --- 드래그 관련 상태 ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartInfo, setDragStartInfo] = useState<{
    day: dayString;
    index: number;
  } | null>(null);
  
  // 리렌더링 없이 즉각적인 인덱스 참조를 위해 Ref 사용
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
  }, [selectedCell]); // selectedCell 변경 시 데이터 갱신

  // --- 공통 로직: 범위 선택 (Store 업데이트) ---
  const selectRange = (
    day: dayString,
    startIndex: number,
    endIndex: number
  ) => {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const newCells: MakeMemberTimetableRequest[] = [];

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

  // --- 이벤트 핸들러 (Mouse & Touch 통합) ---

  // 1. 드래그 시작 (MouseDown / TouchStart)
  const handleStart = (day: dayString, timeIndex: number) => {
    setIsDragging(true);
    setDragStartInfo({ day, index: timeIndex });
    dragEndIndexRef.current = timeIndex;
    
    // 시작 시 기존 선택 초기화 및 시작점 표시
    clearCells();
    selectRange(day, timeIndex, timeIndex);
  };

  // 2. 드래그 중 이동 - PC (MouseEnter)
  const handleEnter = (day: dayString, timeIndex: number) => {
    if (!isDragging || !dragStartInfo) return;
    
    // 다른 요일로 넘어가면 무시
    if (day !== dragStartInfo.day) return;
    
    // 성능 최적화: 인덱스 변화가 없으면 무시
    if (dragEndIndexRef.current === timeIndex) return;

    dragEndIndexRef.current = timeIndex;
    selectRange(dragStartInfo.day, dragStartInfo.index, timeIndex);
  };

  // 3. 드래그 중 이동 - Mobile (TouchMove) [핵심 로직]
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartInfo) return;

    const touch = e.touches[0];
    // 현재 터치 좌표에 있는 DOM 요소를 찾음
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element) {
      // data-속성을 통해 요일과 인덱스 정보를 추출
      const day = element.getAttribute("data-day") as dayString | null;
      const indexStr = element.getAttribute("data-index");

      if (day && indexStr) {
        const index = parseInt(indexStr, 10);
        // 기존 handleEnter 로직 재사용
        handleEnter(day, index);
      }
    }
  };

  // 4. 드래그 종료 (MouseUp / TouchEnd)
  const handleEnd = () => {
    if (isDragging) {
      // 드래그 종료 시 Drawer 오픈
      setIsEditing(true);
    }

    setIsDragging(false);
    setDragStartInfo(null);
    dragEndIndexRef.current = null;
  };

  // 기존 이벤트 클릭 핸들러
  const handleEventClick = (event: LookupTimetableResponse) => {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id));

    if (isEditing && event.id) {
      if (confirm("이 일정을 삭제하시겠습니까?")) {
        deleteEvent(event.id).then(() => loadTimeTable());
      }
    }
  };

  return (
    <div className="relative pb-64">
      {/* Drawer 컴포넌트 */}
      <EditTableDrawer fetchTable={loadTimeTable} />

      <div
        className="grid select-none"
        // PC: 드래그 종료 및 영역 이탈 처리
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        // Mobile: 터치 종료 처리
        onTouchEnd={handleEnd}
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridTemplateRows: `repeat(${TIME_SLOTS.length}, 80px)`,
          gap: "1.5px",
          backgroundColor: "#D7D7D9",
          // [핵심] 모바일 드래그 시 브라우저 스크롤 방지
          touchAction: "none",
        }}
      >
        {/* --- 1. 배경 그리드 셀 (인터랙션 레이어) --- */}
        {TIME_SLOTS.map((time, rowIndex) => {
          if (rowIndex === TIME_SLOTS.length - 1) return null;

          return Object.keys(DAY_TO_COL).map((day, colIndex) => (
            <div
              key={`${time}-${day}`}
              // [핵심] TouchMove에서 식별하기 위한 데이터 속성 주입
              data-day={day}
              data-index={rowIndex}
              
              // PC 이벤트
              onMouseDown={() => handleStart(day as dayString, rowIndex)}
              onMouseEnter={() => handleEnter(day as dayString, rowIndex)}
              
              // Mobile 이벤트
              onTouchStart={() => handleStart(day as dayString, rowIndex)}
              onTouchMove={handleTouchMove}

              style={{
                backgroundColor: "#f5f5f5",
                gridRow: rowIndex + 1,
                gridColumn: colIndex + 1,
                cursor: isEditing ? "row-resize" : "pointer",
              }}
            ></div>
          ));
        })}

        {/* --- 2. 시간 라벨 --- */}
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

        {/* --- 3. 등록된 이벤트 렌더링 --- */}
        {loadTable.map((event: LookupTimetableResponse) => {
          if (!event.day || !(event.day in DAY_TO_COL)) return null;

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
              className="w-full overflow-hidden flex flex-col p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-800 hover:brightness-95"
              style={{
                gridRow: `${gridRowStart} / ${gridRowEnd}`,
                gridColumn: gridColumn,
                backgroundColor: event.color,
                boxShadow: isSelected
                  ? "0 0 0 2px #3B82F6"
                  : "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                zIndex: isSelected ? 10 : 5,
              }}
            >
              <div className="flex-grow text-white">
                <p className="font-bold text-[10px] break-words">
                  {event.eventName}
                </p>
                <p className="text-[8px] break-words">{event.eventDetail}</p>
              </div>
              <div className="flex flex-col text-right text-[8px] mt-auto text-white opacity-80">
                <p>{formatToHourMinute(event.startTime as string)}</p>
                <p>{formatToHourMinute(event.endTime as string)}</p>
              </div>
            </div>
          );
        })}

        {/* --- 4. 드래그 선택 중인 셀 표시 (Visual Feedback) --- */}
        {selectedCell.map((cell) => {
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