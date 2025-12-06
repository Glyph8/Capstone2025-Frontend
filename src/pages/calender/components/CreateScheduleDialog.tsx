import {
  createScheduleApi,
  deleteDetailScheduleApi,
  getDetailScheduleApi,
  getExtraCurriApi,
  patchScheduleApi,
} from "@/apis/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WideAcceptButton from "@/components/WideAcceptButton";
import { useEffect, useState } from "react";
import type {
  ChangeScheduleRequest,
  CreateScheduleRequest,
  ExtracurricularResponse,
} from "@/generated-api/Api";
import { formatKoreanDateTimeNative } from "@/utils/date";
import { Trash, Search, CalendarClock, MessageCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";
import { useChatBotPageStore } from "@/store/store";

interface CreateScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId?: number;
  initialDate?: Date; // [NEW] 선택된 날짜를 받기 위한 prop 추가
  onSuccess: () => void;
}

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000; // ms 단위 오프셋
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

export const CreateScheduleDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
  initialDate,
  onSuccess,
}: CreateScheduleDialogProps) => {
  const [scheduleType, setScheduleType] = useState<
    "NORMAL" | "EXTRACURRICULAR" | undefined
  >("NORMAL");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startDateTime: "",
    endDateTime: "",
    extracurricularId: null as number | null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtracurricularResponse[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);
  const { openChatBotPage, setPendingMessage } = useChatBotPageStore();

  const handleSendToChatbot = () => {
    const message = `내 일정 중 "${
      formData.title
    }"에 대해 자세히 알려줘. \n(내용: ${formData.content || "없음"})`;
    setPendingMessage(message);
    openChatBotPage();
    setIsOpen(false);
  };

  // 검색 로직 (기존 유지)
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const result = await getExtraCurriApi(debouncedQuery);
        setSearchResults(result?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };
    if (scheduleType === "EXTRACURRICULAR") {
      search();
    }
  }, [debouncedQuery, scheduleType]);

  useEffect(() => {
    if (isOpen) {
      if (scheduleId && scheduleId !== 0) {
        getDetailScheduleApi(scheduleId).then((data) => {
          if (data) {
            setFormData({
              title: data.title ?? "",
              content: data.content ?? "",
              startDateTime: data.startDateTime ?? "",
              endDateTime: data.endDateTime ?? "",
              extracurricularId: Number(data.extracurricularField ?? null),
            });
            if (data.extracurricularField) setScheduleType("EXTRACURRICULAR");
            else setScheduleType("NORMAL");
          }
        });
      } else {
        setScheduleType("NORMAL");

        const baseDate = initialDate || new Date();
        const startDateStr = toLocalISOString(baseDate);
        const endDateObj = new Date(baseDate.getTime() + 60 * 60 * 1000); // 1시간 뒤
        const endDateStr = toLocalISOString(endDateObj);

        setFormData({
          title: "",
          content: "",
          startDateTime: startDateStr,
          endDateTime: endDateStr,
          extracurricularId: null,
        });
        setSearchQuery("");
        setSearchResults([]);
      }
    }
  }, [isOpen, scheduleId, initialDate]); // initialDate 의존성 추가

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectExtraCurri = (item: ExtracurricularResponse) => {
    setFormData((prev) => ({
      ...prev,
      title: item.title ?? "",
      content: item.url ?? prev.content,
      startDateTime: item.activityStart ?? prev.startDateTime,
      endDateTime: item.activityEnd ?? prev.endDateTime,
      extracurricularId: item.id ?? null,
    }));
    setSearchResults([]); // 선택 후 검색 결과 닫기 (UX 개선)
    setSearchQuery(""); // 검색어 초기화
  };

  const handleSubmit = async () => {
    if (!formData.title) return toast.error("제목을 입력해주세요.");

    const payload = {
      title: formData.title,
      content: formData.content,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
    };

    try {
      if (scheduleId === 0) {
        await createScheduleApi({
          ...payload,
          extracurricularId: formData.extracurricularId, // 수정: 상태값 사용
        } as CreateScheduleRequest);
      } else {
        await patchScheduleApi({
          ...payload,
          extracurricularId: formData.extracurricularId,
        } as ChangeScheduleRequest);
      }
      onSuccess();
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("일정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!scheduleId) return;
    if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      await deleteDetailScheduleApi(scheduleId);
      onSuccess();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90%] max-w-sm p-5 bg-white rounded-xl shadow-lg gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg font-bold">
            <button
              onClick={handleSendToChatbot}
              className="relative bottom-4 flex-1 p-2.5 text-[#0076FE] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              title="이 일정을 챗봇에게 질문하기"
              aria-label="챗봇 질문"
            >
              <MessageCircle size={20} />
            </button>
            <p className="flex-1 relative right-3">{scheduleId === 0 ? "새 일정 추가" : "일정 수정"}</p>
            <p className="flex-1">{}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["NORMAL", "EXTRACURRICULAR"] as const).map((type) => (
              <button
                key={type}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  scheduleType === type
                    ? "bg-white text-[#01A862] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setScheduleType(type)}
              >
                {type === "NORMAL" ? "일반 일정" : "비교과 활동"}
              </button>
            ))}
          </div>

          {scheduleType === "EXTRACURRICULAR" && (
            <div className="relative animate-in fade-in zoom-in-95 duration-200">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 border rounded-lg focus:ring-1 focus:ring-[#01A862] focus:outline-none transition-all"
                  placeholder="비교과 활동 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5 h-4 w-4 border-2 border-[#01A862] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-white border rounded-lg shadow-md divide-y">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectExtraCurri(item)}
                      className="p-2.5 cursor-pointer hover:bg-blue-50 text-sm"
                    >
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-xs text-gray-400">
                        ~ {formatKoreanDateTimeNative(item.activityEnd)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="일정 제목"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <CalendarClock size={12} /> 시작
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                className="w-full p-2 h-9 text-xs border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <CalendarClock size={12} /> 종료
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                className="w-full p-2 h-9 text-xs border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
            placeholder="메모를 입력하세요"
          />
        </div>

        <DialogFooter className="mt-2 flex flex-row gap-2 items-center">
          {scheduleId !== 0 && (
            <button
              onClick={handleDelete}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="삭제"
            >
              <Trash size={18} />
            </button>
          )}

          <div className="flex-1">
            <WideAcceptButton
              text={scheduleId === 0 ? "등록" : "수정"}
              isClickable={true}
              handleClick={handleSubmit}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
