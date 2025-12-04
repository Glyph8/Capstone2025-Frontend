import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { enrollAcademicInfo } from "../../apis/auth";
import type { AcademicInfo } from "@/types/auth-types"; // 타입 경로 확인 필요
import WideAcceptButton from "../../components/WideAcceptButton";
import SelectItemButton from "../../components/SelectItemButton";
import TextInputForm from "../../components/TextInputForm";

const SetAcademicInfoPage = () => {
  const navigate = useNavigate();

  // 초기값 설정
  const [userAcademicStatus, setUserAcademicStatus] = useState("ENROLLED");
  const [userGrade, setUserGrade] = useState(1);
  const [userCollege, setUserCollege] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [userName, setUserName] = useState("");

  // 유효성 검사 (모든 텍스트 필드가 입력되었는지 확인)
  const isValid = useMemo(() => {
    return (
      userCollege.trim().length > 0 &&
      userDepartment.trim().length > 0 &&
      userName.trim().length > 0
    );
  }, [userCollege, userDepartment, userName]);

  const completeSign = async () => {
    if (!isValid) {
        toast.error("모든 정보를 입력해주세요.");
        return;
    }

    const academicInfo = {
      academicStatus: userAcademicStatus,
      grade: userGrade,
      college: userCollege,
      department: userDepartment,
      name: userName,
    };

    try {
      const finalResult = await enrollAcademicInfo(academicInfo as AcademicInfo);
      if (finalResult) {
        toast.success("가입이 완료되었습니다!");
        navigate("/main/timetable");
      } else {
        toast.error("정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("서버 통신 중 에러가 발생했습니다.");
    }
  };

  // 🎨 공통 섹션 래퍼 (Update 페이지와 통일)
  const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1 ml-1">{title}</h3>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-28">
      {/* 상단 헤더 */}
      <header className="px-5 pt-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">학적 정보 입력</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          원활한 서비스 이용을 위해 <br />
          학교 정보를 입력해주세요.
        </p>
      </header>

      <main className="w-full px-5">
        {/* 1. 기본 학적 상태 섹션 */}
        <SectionContainer title="기본 정보">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">재학 상태</label>
            <div className="flex gap-2">
              <SelectItemButton
                text="재학"
                isSelected={userAcademicStatus === "ENROLLED"}
                handleClick={() => setUserAcademicStatus("ENROLLED")}
              />
              <SelectItemButton
                text="휴학"
                isSelected={userAcademicStatus === "LEAVE_OF_ABSENCE"}
                handleClick={() => setUserAcademicStatus("LEAVE_OF_ABSENCE")}
              />
              <SelectItemButton
                text="졸업"
                isSelected={userAcademicStatus === "GRADUATED"}
                handleClick={() => setUserAcademicStatus("GRADUATED")}
              />
            </div>
          </div>

          <div className="border-t border-gray-50 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">학년</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((grade) => (
                <SelectItemButton
                  key={grade}
                  text={`${grade}학년`}
                  isSelected={userGrade === grade}
                  handleClick={() => setUserGrade(grade)}
                />
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 2. 소속 및 이름 입력 섹션 */}
        <SectionContainer title="상세 정보">
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">단과 대학</span>
              <TextInputForm
                label=""
                placeholder="예 : 공과대학"
                isError={false}
                isPW={false}
                data={userCollege}
                handleChange={setUserCollege}
              />
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">학과</span>
              <TextInputForm
                label=""
                placeholder="예: 컴퓨터공학부"
                isError={false}
                isPW={false}
                data={userDepartment}
                handleChange={setUserDepartment}
              />
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">이름</span>
              <TextInputForm
                label=""
                placeholder="예: 김건국"
                isError={false}
                isPW={false}
                data={userName}
                handleChange={setUserName}
              />
              <p className="text-xs text-gray-400 mt-2 ml-1">
                * 서비스 내 챗봇이 회원님을 부를 때 사용됩니다.
              </p>
            </div>
          </div>
        </SectionContainer>
      </main>

      {/* 하단 고정 버튼 (Sticky Footer) */}
      <div className="flex justify-center items-center p-5 pb-8 safe-area-bottom fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-10">
        <div className="w-full max-w-md">
            <WideAcceptButton
            text="가입 완료"
            isClickable={isValid} // 모든 정보 입력 시에만 활성화
            handleClick={completeSign}
            />
        </div>
      </div>
    </div>
  );
};

export default SetAcademicInfoPage;