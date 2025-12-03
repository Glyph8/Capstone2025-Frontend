import { useNavigate } from "react-router-dom";
import UpperNav from "../../components/UpperNav";
import WideAcceptButton from "../../components/WideAcceptButton";
import { useEffect, useState } from "react";
import { getMyInfo } from "@/apis/mypage";
import type { LookupMemberInfoResponse } from "@/generated-api/Api";
import type {
  AcademicStatus,
  KoreanAcademicStatus,
} from "@/types/mypage-types";
import ScheduleNotificationSwitch from "./ScheduleNotificationSwitch";

const ACADEMIC_STATUS_MAP: Record<AcademicStatus, KoreanAcademicStatus> = {
  ENROLLED: "재학",
  LEAVE_OF_ABSENCE: "휴학",
  GRADUATED: "졸업",
};

const MyPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LookupMemberInfoResponse>({
    id: -1,
    name: "사용자 이름을 불러오는 중입니다",
    email: "~~@konkuk.ac.kr",
    academicStatus: "ENROLLED",
    college: "공과대학",
    department: "컴퓨터공학부",
    grade: 1,
  });

  const handleAcademicInfo = () => {
    // navigate("/main/mypage/academic-info");
    navigate("/main/mypage/academic-info");
  };

  const handleInterest = () => {
    navigate("/main/mypage/interest");
  };

  const handleReviewBtn = () => {
    navigate("/main/mypage/history");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // 필요시, 전역 상태, 캐시, 리프레쉬 토큰도 제거
    navigate("/auth/login");
  };

  const getMyProfile = async () => {
    try {
      const profileData = await getMyInfo();
      if (profileData) setProfile(profileData);
      else console.log(profileData, "undefinded 가능성 있음");
    } catch (error) {
      console.error("시간표 불러오기 실패", error);
      throw error;
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div className="w-full h-full">
      <UpperNav text="회원정보" />
      <div className="w-full bg-white px-11">
        <nav className="flex flex-col justify-start items-start pt-8">
          <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold leading-7">
            회원 정보 수정
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col gap-3 pb-3">
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                이름 : {profile.name}
              </div>
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                email : {profile.email}
              </div>
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                소속 대학 : {profile.college}
              </div>
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                학과 : {profile.department}
              </div>
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                학년 : {profile.grade}
              </div>
              <div className="flex justify-start items-center text-black text-base font-light leading-none tracking-wide">
                현재 학적 :{" "}
                {ACADEMIC_STATUS_MAP[profile.academicStatus ?? "ENROLLED"]}
              </div>
            </div>

            <div className="h-14 flex justify-between items-center text-black text-base font-light leading-none tracking-wide">
              <h2>학적정보 수정</h2>
              <button onClick={handleAcademicInfo}>
                <img src="/icons/arrow-right.svg" alt="다음버튼" />
              </button>
            </div>

            <div className="h-14 flex justify-between items-center text-black text-base font-light font-['Pretendard'] leading-none tracking-wide">
              <h2>관심 카테고리 수정</h2>
              <button onClick={handleInterest}>
                <img src="/icons/arrow-right.svg" alt="다음 버튼" />
              </button>
            </div>
            <nav className="h-14 items-center flex justify-between">
              <h2>알림 설정</h2>
              <ScheduleNotificationSwitch />
            </nav>
          </div>
        </nav>

        <div className="w-full flex flex-col justify-center items-center mt-16">
          <WideAcceptButton
            text="히스토리 조회 및 리뷰작성"
            isClickable={true}
            handleClick={handleReviewBtn}
          />
          <div
            className="mt-32 text-black text-sm font-normal
            underline leading-loose"
            onClick={handleLogout}
          >
            로그아웃
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
