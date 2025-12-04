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
import { Trash, Search } from "lucide-react"; // 아이콘 활용
import { useDebounce } from "@/hooks/useDebounce"; // 위에서 만든 훅 import 가정
import toast from "react-hot-toast";

interface CreateScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId?: number;
  onSuccess: () => void;
}

export const CreateScheduleDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
  onSuccess,
}: CreateScheduleDialogProps) => {
  const [scheduleType, setScheduleType] = useState(
    "NORMAL" as "NORMAL" | "EXTRACURRICULAR" | undefined
  );
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startDateTime: "",
    endDateTime: "",
    extracurricularId: null as number | null, // 비교과 ID
  });

  // 비교과 검색 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtracurricularResponse[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false); // 로딩 상태 UI용

  // 0.5초 디바운스 적용
  const debouncedQuery = useDebounce(searchQuery, 500);

  // 1. 디바운스된 쿼리로 비교과 검색 자동 수행
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

    // 타입이 비교과일 때만 검색
    if (scheduleType === "EXTRACURRICULAR") {
      search();
    }
  }, [debouncedQuery, scheduleType]);

  // 2. 기존 데이터 로드 (상세 조회)
  useEffect(() => {
    if (isOpen && scheduleId && scheduleId !== 0) {
      getDetailScheduleApi(scheduleId).then((data) => {
        if (data) {
          setFormData({
            title: data.title ?? "",
            content: data.content ?? "",
            startDateTime: data.startDateTime ?? "",
            endDateTime: data.endDateTime ?? "",
            extracurricularId: Number(
              data.extracurricularField ?? null
            ),
          });
          setScheduleType("EXTRACURRICULAR")
        }
      });
    } else if (isOpen && scheduleId === 0) {
      // 생성 모드 초기화
      setScheduleType("NORMAL");
      setFormData({
        title: "",
        content: "",
        startDateTime: "",
        endDateTime: "",
        extracurricularId: null,
      });
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, scheduleId]);

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 비교과 아이템 선택 핸들러
  const handleSelectExtraCurri = (item: ExtracurricularResponse) => {
    setFormData((prev) => ({
      ...prev,
      title: item.title ?? "",
      content: item.url ?? prev.content,
      startDateTime: item.activityStart ?? prev.startDateTime,
      endDateTime: item.activityEnd ?? prev.endDateTime,
      extracurricularId: item.id ?? null,
    }));

  };

  // 제출 핸들러
  const handleSubmit = async () => {
    // 유효성 검사 (간단 예시)
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
          extracurricularId: scheduleId!,
        } as CreateScheduleRequest); // API 타입에 맞게 조정
      } else {
        await patchScheduleApi({
          ...payload,
          extracurricularId: scheduleId!,
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
      <DialogContent className="w-[90%] max-w-md p-6 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogTitle className="text-xl font-bold mb-4">
          {scheduleId === 0 ? "새 일정 추가" : "일정 수정"}
        </DialogTitle>

        <div className="flex flex-col gap-5">
          {/* 1. 일정 타입 선택 (Radio Button UI 개선) */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["NORMAL", "EXTRACURRICULAR"] as const).map((type) => (
              <button
                key={type}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  scheduleType === type
                    ? "bg-white text-[#01A862] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() =>
                   setScheduleType(type)
                  // setFormData((prev) => ({ ...prev, scheduleType: type }))
                }
              >
                {type === "NORMAL" ? "일반 일정" : "비교과 활동"}
              </button>
            ))}
          </div>

          {/* 2. 비교과 검색 영역 (타입이 비교과일 때만 노출) */}
          {scheduleType === "EXTRACURRICULAR" && (
            <div className="relative animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#01A862] focus:outline-none transition-all"
                  placeholder="비교과 활동 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-3 h-4 w-4 border-2 border-[#01A862] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* 검색 결과 리스트 */}
              {searchResults.length > 0 && (
                <ul className="mt-2 max-h-48 overflow-y-auto bg-white border rounded-lg shadow-sm divide-y">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectExtraCurri(item)}
                      className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col gap-1 ${
                        formData.extracurricularId === item.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatKoreanDateTimeNative(item.activityStart)} ~{" "}
                        {formatKoreanDateTimeNative(item.activityEnd)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 3. 제목 입력 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">제목</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="일정 제목을 입력하세요"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 4. 시간 입력 (Grid 레이아웃 활용) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">시작</label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">종료</label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* 5. 설명 입력 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">메모</label>
            <textarea
              name="content" // input 대신 textarea 사용으로 UX 개선
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={3}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              placeholder="상세 내용을 입력하세요"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row gap-2 sm:justify-between">
          {scheduleId !== 0 && (
            <button
              onClick={handleDelete}
              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="삭제"
            >
              <Trash size={20} />
            </button>
          )}
          <div className="flex-1 flex justify-center items-center">
            <WideAcceptButton
              text={scheduleId === 0 ? "등록하기" : "수정하기"}
              isClickable={true}
              handleClick={handleSubmit}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
