import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { enrollAcademicInfo } from "../../apis/auth";
import { getMyInfo } from "@/apis/mypage";
import type { AcademicInfo } from "@/types/auth-types";
import type { AcademicStatus } from "@/types/mypage-types";
import WideAcceptButton from "../../components/WideAcceptButton";
import SelectItemButton from "../../components/SelectItemButton";
import TextInputForm from "../../components/TextInputForm";
import UpperNav from "@/components/UpperNav";
import Skeleton from "@/components/Skeleton";

const UpdateAcademicInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [academicStatus, setAcademicStatus] = useState<AcademicStatus>("ENROLLED");
  const [grade, setGrade] = useState<number>(1);
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCurrentInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getMyInfo();
        if (data) {
          setAcademicStatus(data.academicStatus!);
          setGrade(data.grade!);
          setCollege(data.college!);
          setDepartment(data.department!);
          setName(data.name!);
        }
      } catch (error) {
        console.error("기존 정보 로딩 실패", error);
        toast.error("정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentInfo();
  }, []);

  // Validation
  const isValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      college.trim().length > 0 &&
      department.trim().length > 0
    );
  }, [name, college, department]);

  // Submit Handler
  const handleSubmit = async () => {
    if (!isValid) return;

    const payload: AcademicInfo = {
      academicStatus,
      grade,
      college,
      department,
      name,
    };

    try {
      const result = await enrollAcademicInfo(payload);
      if (result) {
        toast.success("학적 정보가 수정되었습니다.");
        navigate("/main/mypage/profile");
      } else {
        toast.error("정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // 🎨 공통 섹션 래퍼 (MyPage와 디자인 통일)
  const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1 ml-1">{title}</h3>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
        {children}
      </div>
    </section>
  );

  // 로딩 화면 (Skeleton)
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-50">
        <UpperNav text="학적 정보 수정" />
        <div className="px-5 mt-6 space-y-6">
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-28">
      <UpperNav text="학적 정보 수정" />

      <main className="w-full px-5 pt-6">
        {/* 1. 상태 및 학년 선택 섹션 */}
        <SectionContainer title="기본 학적 상태">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">재학 상태</label>
            <div className="flex gap-2">
              {(["ENROLLED", "LEAVE_OF_ABSENCE", "GRADUATED"] as const).map((status) => (
                <SelectItemButton
                  key={status}
                  text={status === "ENROLLED" ? "재학" : status === "LEAVE_OF_ABSENCE" ? "휴학" : "졸업"}
                  isSelected={academicStatus === status}
                  handleClick={() => setAcademicStatus(status)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-50 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">학년</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((g) => (
                <SelectItemButton
                  key={g}
                  text={`${g}학년`}
                  isSelected={grade === g}
                  handleClick={() => setGrade(g)}
                />
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 2. 상세 정보 입력 섹션 */}
        <SectionContainer title="상세 정보">
          {/* TextInputForm 컴포넌트 내부 여백 등을 고려하여 배치 */}
          <div className="flex flex-col gap-7">
            <div className="mb-1">
                <span className="text-sm font-medium text-gray-700">단과 대학</span>
                <TextInputForm
                    label="" 
                    placeholder="예 : 공과대학"
                    isError={false}
                    isPW={false}
                    data={college}
                    handleChange={setCollege}
                />
            </div>
            
            <div className="mb-1">
                <span className="text-sm font-medium text-gray-700">학과</span>
                <TextInputForm
                    label=""
                    placeholder="예: 컴퓨터공학부"
                    isError={false}
                    isPW={false}
                    data={department}
                    handleChange={setDepartment}
                />
            </div>

            <div>
                <span className="text-sm font-medium text-gray-700">이름</span>
                <TextInputForm
                    label=""
                    placeholder="예: 김건국"
                    isError={false}
                    isPW={false}
                    data={name}
                    handleChange={setName}
                />
                <p className="text-xs text-gray-400 mt-2 px-1">
                  * 챗봇 서비스에서 불릴 이름입니다.
                </p>
            </div>
          </div>
        </SectionContainer>
      </main>

      {/* 3. 하단 고정 버튼 (Sticky Footer) */}
      <div className="flex justify-center items-center p-5 pb-8 safe-area-bottom z-10 transition-all">
        <WideAcceptButton
          text="변경 사항 저장하기"
          isClickable={isValid}
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UpdateAcademicInfoPage;