import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSelectCellStore, useAddTimeTableStore } from "@/store/store";
import { deleteEvent, patchEvent, sendEventRequest } from "@/apis/timetable";
import SelectedCell from "./SelectedCell";
import { Button, Input } from "@headlessui/react";
import type {
  ChangeTimetableRequest,
  LocalTime,
  MakeMemberTimetableRequest,
} from "@/generated-api/Api";
import { formatLocalTime } from "@/utils/timetableUtils";
import toast from "react-hot-toast";

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
  const {
    selectedCell,
    clearCells,
    selectedExistingEvent,
    setSelectedExistingEvent,
  } = useSelectCellStore();
  const { isEditing, setIsEditing } = useAddTimeTableStore();

  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  useEffect(() => {
    if (isEditing) {
      if (selectedExistingEvent) {
        setEventName(selectedExistingEvent.eventName || "");
        setEventDetail(selectedExistingEvent.eventDetail || "");
        setSelectedColor(selectedExistingEvent.color || COLOR_PALETTE[0]);
      } else {
        setEventName("");
        setEventDetail("");
        setSelectedColor(COLOR_PALETTE[0]);
      }
    }
  }, [isEditing, selectedExistingEvent]);

  const handleClose = () => {
    setIsEditing(false);
    clearCells();
    setSelectedExistingEvent(null); // 수정 중이던 정보 초기화
    setEventName("");
    setEventDetail("");
  };

  const handleDelete = async () => {
    if (!selectedExistingEvent?.id) return;

    try {
      await deleteEvent(selectedExistingEvent.id);
      await fetchTable();
      handleClose();
    } catch (e) {
      console.error("삭제 실패", e);
      toast.error("일정 삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    if (!eventName.trim()) {
      toast.error("활동명을 입력해주세요.");
      return;
    }

    if (selectedCell.length === 0) {
      toast.error("시간이 선택되지 않았습니다.");
      return;
    }

    try {
      if (selectedExistingEvent) {
        const sortedCells = [...selectedCell].sort(
          (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)
        );
        const startTime = sortedCells[0].startTime;
        const endTime = sortedCells[sortedCells.length - 1].endTime;

        const updateRequest = {
          id: selectedExistingEvent.id, // 필수
          day: selectedCell[0].day, // 요일 변경 가능성 고려
          startTime: formatLocalTime(startTime),
          endTime: formatLocalTime(endTime),
          eventName: eventName,
          eventDetail: eventDetail,
          color: selectedColor,
        };

        await patchEvent(updateRequest as ChangeTimetableRequest);
      } else {
        const cellsByDay = selectedCell.reduce((acc, cell) => {
          const day = cell.day || "MON";
          if (!acc[day]) acc[day] = [];
          acc[day].push(cell);
          return acc;
        }, {} as Record<string, typeof selectedCell>);

        const mergedEvents = [];
        for (const day in cellsByDay) {
          const cells = cellsByDay[day];
          cells.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
          const start = cells[0].startTime;
          const end = cells[cells.length - 1].endTime;

          mergedEvents.push({
            day: day as "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
            // startTime: start,
            // endTime: end,
            startTime: formatLocalTime(start),
            endTime: formatLocalTime(end),
            eventName,
            eventDetail,
            color: selectedColor,
          });
        }
        await sendEventRequest(mergedEvents as MakeMemberTimetableRequest[]);
      }

      // 공통 마무리
      await fetchTable();
      handleClose();
    } catch (e) {
      console.error("저장 실패", e);
      toast.error("일정 저장에 실패했습니다.");
    }
  };

  return (
    <Drawer
      open={isEditing}
      onOpenChange={(open) => !open && handleClose()}
      modal={false}
    >
      <DrawerContent
        className="pb-6 focus:outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={() => {}}
      >
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle className="font-bold text-lg">
            {selectedExistingEvent ? "일정 수정" : "일정 추가"}
          </DrawerTitle>
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
          {selectedCell.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <SelectedCell
                selectedCell={selectedCell}
                clearCells={clearCells}
              />
            </div>
          )}

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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              색상 선택
            </label>
            <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar px-1">
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

        <DrawerFooter className="px-5 mt-4 flex-col gap-2 text-white">
          {selectedExistingEvent && (
            <Button
              className="w-full rounded-[500px] bg-[#01A862]  hover:bg-[#004731] h-12 text-md font-semibold"
              onClick={handleDelete}
            >
              삭제
            </Button>
          )}
          <div className="flex flex-row gap-2">
            <Button
              className="w-[50%] rounded-[500px] bg-[#01A862] hover:bg-[#004731] h-12 text-md font-semibold"
              onClick={handleClose}
            >
              취소
            </Button>

            <Button
              onClick={handleSave}
              className="w-[50%] flex-[2] rounded-[500px] bg-[#01A862]  hover:bg-[#004731]"
            >
              {selectedExistingEvent ? "수정 완료" : "등록하기"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
