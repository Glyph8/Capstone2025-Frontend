import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSelectCellStore, useAddTimeTableStore } from "@/store/store";
import { sendEventRequest } from "@/apis/timetable";
import SelectedCell from "./SelectedCell";
import { Button, Input } from "@headlessui/react";
import type {
  LocalTime,
  MakeMemberTimetableRequest,
} from "@/generated-api/Api";
import { formatLocalTime } from "@/utils/timetableUtils";

// 사용자에게 제공할 컬러 팔레트 (랜덤 대신 선택권 부여)
const COLOR_PALETTE = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#4ADE80",
  "#3B82F6",
  "#818CF8",
  "#A78BFA",
  "#F472B6",
  "#08AC64",
  "#005B3F",
  "#64748B",
];

interface EditTableDrawerProps {
  fetchTable: () => void;
}

export const toMinutes = (time: LocalTime | undefined | null): number => {
  if (!time) {
    return 0;
  }
  // hour나 minute가 undefined일 경우 0으로 처리 (Optional Chaining & Nullish Coalescing)
  const hour = time.hour ?? 0;
  const minute = time.minute ?? 0;

  return hour * 60 + minute;
};

export default function EditTableDrawer({ fetchTable }: EditTableDrawerProps) {
  const { selectedCell, clearCells } = useSelectCellStore();
  const { isEditing, setIsEditing } = useAddTimeTableStore();

  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  // Drawer가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isEditing) {
      setEventName("");
      setEventDetail("");
      setSelectedColor(COLOR_PALETTE[0]);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!eventName.trim()) {
      alert("활동명을 입력해주세요.");
      return;
    }

    if (selectedCell.length === 0) return;

    const cellsByDay = selectedCell.reduce((acc, cell) => {
      const day = cell.day || "MON";
      if (!acc[day]) acc[day] = [];
      acc[day].push(cell);
      return acc;
    }, {} as Record<string, typeof selectedCell>);

    const mergedEvents = [];

    for (const day in cellsByDay) {
      const cells = cellsByDay[day];

      // 시간을 기준으로 오름차순 정렬 (10:00, 10:30, 11:00 ...)
      cells.sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return toMinutes(a.startTime) - toMinutes(b.startTime);
      });

      // 병합 시작
      let currentStart = cells[0].startTime;
      let currentEnd = cells[0].endTime;

      for (let i = 1; i < cells.length; i++) {
        const nextCell = cells[i];

        // "현재 덩어리의 끝 시간"과 "다음 셀의 시작 시간"이 같으면 연속된 것임
        if (toMinutes(currentEnd!) === toMinutes(nextCell.startTime!)) {
          // 연속됨 -> 끝 시간만 확장
          currentEnd = nextCell.endTime;
        } else {
          // 끊김 -> 지금까지 덩어리를 저장하고 새로운 덩어리 시작
          mergedEvents.push({
            day: day as any,
            startTime: formatLocalTime(currentStart),
            endTime: formatLocalTime(currentEnd),
            eventName,
            eventDetail,
            color: selectedColor,
          });
          currentStart = nextCell.startTime;
          currentEnd = nextCell.endTime;
        }
      }
      // 마지막 남은 덩어리 추가
      mergedEvents.push({
        day: day as any,
        startTime: formatLocalTime(currentStart),
        endTime: formatLocalTime(currentEnd),
        eventName,
        eventDetail,
        color: selectedColor,
      });
    }

    // --- [서버 전송] ---
    try {
      // 스웨거와 일치하지 않지만, 이게 맞음;;
      await sendEventRequest(mergedEvents as MakeMemberTimetableRequest[]);
      await fetchTable();
      clearCells();
      setIsEditing(false);
    } catch (e) {
      console.error("저장 실패", e);
    }
  };

  const handleClose = () => {
    setIsEditing(false); // 드로어 닫기
    clearCells(); // 선택된 셀도 같이 초기화 (선택사항)
  };

  return (
    <Drawer open={isEditing} onOpenChange={setIsEditing} modal={false}>
      <DrawerContent
        className="pb-6 focus:outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={() => {}}
      >
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle className="font-bold text-lg">일정 추가하기</DrawerTitle>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </DrawerHeader>

        <div className="px-5 space-y-6">
          {/* 1. 선택된 시간 정보 */}
          {selectedCell.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <SelectedCell
                selectedCell={selectedCell}
                clearCells={clearCells}
              />
            </div>
          )}

          {/* 2. 입력 폼 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                활동명 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="예: 컴퓨터네트워크"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="text-base" // 모바일에서 16px 이하여야 줌인 안됨
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                상세 설명
              </label>
              <Input
                placeholder="예: 공학관 C487"
                value={eventDetail}
                onChange={(e) => setEventDetail(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          {/* 3. 색상 선택 (가로 스크롤 혹은 그리드) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              색상 선택
            </label>
            <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full flex-shrink-0 transition-all border-2 ${
                    selectedColor === color
                      ? "border-black scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`${color} 선택`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. 하단 버튼 액션 */}
        <DrawerFooter className="px-5 mt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-[#005B3F] hover:bg-[#004731] h-12 text-md font-semibold"
          >
            일정 등록하기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
