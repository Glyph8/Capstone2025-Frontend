import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInfo } from "@/apis/mypage";
import type { LookupMemberInfoResponse } from "@/generated-api/Api";
import type { AcademicStatus, KoreanAcademicStatus } from "@/types/mypage-types";
import ScheduleNotificationSwitch from "./ScheduleNotificationSwitch";
import UpperNav from "../../components/UpperNav";
import WideAcceptButton from "../../components/WideAcceptButton";
import Skeleton from "@/components/Skeleton"; // 위에서 만든 스켈레톤

const ACADEMIC_STATUS_MAP: Record<AcademicStatus, KoreanAcademicStatus> = {
  ENROLLED: "재학",
  LEAVE_OF_ABSENCE: "휴학",
  GRADUATED: "졸업",
};

// 🎨 스타일링 된 섹션 아이템 (재사용성)
const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="w-full mb-6">
    <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">{title}</h3>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {children}
    </div>
  </section>
);

const MenuItem = ({ 
  label, 
  value, 
  onClick, 
  isLink = false,
  rightElement 
}: { 
  label: string; 
  value?: string | number; 
  onClick?: () => void; 
  isLink?: boolean;
  rightElement?: React.ReactNode 
}) => (
  <div 
    onClick={onClick}
    className={`
      flex justify-between items-center p-4 min-h-[56px] bg-white border-b border-gray-100 last:border-none
      ${onClick ? "cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors" : ""}
    `}
  >
    <span className="text-gray-700 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      {value && <span className="text-gray-500 text-sm">{value}</span>}
      {rightElement}
      {isLink && <img src="/icons/arrow-right.svg" alt="이동" className="w-5 h-5 opacity-40" />}
    </div>
  </div>
);

const MyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [profile, setProfile] = useState<LookupMemberInfoResponse | null>(null);

  const getMyProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getMyInfo();
      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error("프로필 로딩 실패", error);
      // 에러 처리 (토스트 등)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  const handleLogout = () => {
    if(window.confirm("정말 로그아웃 하시겠습니까?")) {
        localStorage.removeItem("access_token");
        navigate("/auth/login");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <UpperNav text="마이페이지" />
      
      <main className="w-full px-5 pt-6">
        {/* 1. 프로필 헤더 (강조 영역) */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {/* 아바타 이미지가 없다면 이모지나 첫 글자로 대체 */}
            🧑‍💻
          </div>
          {loading ? (
             <div className="flex flex-col items-center gap-2">
               <Skeleton className="w-32 h-6" />
               <Skeleton className="w-48 h-4" />
             </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
            </>
          )}
        </div>

        {/* 2. 학적 정보 섹션 (읽기/수정 복합) */}
        <MenuSection title="학적 정보">
          {loading ? (
             <div className="p-4 space-y-4">
               <Skeleton className="w-full h-6" />
               <Skeleton className="w-full h-6" />
             </div>
          ) : (
            <>
              <MenuItem label="단과대학" value={profile?.college} />
              <MenuItem label="학과" value={profile?.department} />
              <MenuItem label="학년" value={`${profile?.grade}학년`} />
              <MenuItem 
                label="현재 학적" 
                value={ACADEMIC_STATUS_MAP[profile?.academicStatus ?? "ENROLLED"]} 
              />
              {/* 수정 페이지로 이동하는 명확한 진입점 */}
              <MenuItem 
                label="학적 정보 수정하기" 
                isLink 
                onClick={() => navigate("/main/mypage/academic-info")}
                value=""
              />
            </>
          )}
        </MenuSection>

        {/* 3. 설정 및 관리 섹션 */}
        <MenuSection title="설정 및 관리">
            {/* 관심사 수정 */}
            <MenuItem 
                label="관심 카테고리 설정" 
                isLink 
                onClick={() => navigate("/main/mypage/interest")} 
            />
            
            {/* 알림 설정 (스위치 컴포넌트 통합) */}
            <MenuItem 
                label="스케쥴 알림 받기" 
                rightElement={<ScheduleNotificationSwitch />}
            />
        </MenuSection>

        {/* 4. 활동 관리 (CTA 강조) */}
        <div className="mt-8 mb-12 flex flex-col justify-center items-center">
            <WideAcceptButton
                text="히스토리 조회 및 리뷰 작성"
                isClickable={true}
                handleClick={() => navigate("/main/mypage/history")}
            />
            <button 
                onClick={handleLogout}
                className="w-full mt-4 py-3 text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            >
                로그아웃
            </button>
        </div>
      </main>
    </div>
  );
};

export default MyPage;