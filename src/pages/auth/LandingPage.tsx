import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col flex-1 gap-3 justify-center items-center">
      <div className="flex justify-center w-full h-full items-center bg-[#005B3F] text-white text-[25px]">
        졸업프로젝트2
      </div>
      <div className="w-[66px] flex justify-center gap-1.5">
        <div
          className="w-[12px] h-[12px] rounded-full bg-[#005B3F]"
          style={{ backgroundColor: "#144221" }}
        ></div>
        <div
          className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]"
        ></div>
        <div
          className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]"
        ></div>
        <div
          className="w-[12px] h-[12px] rounded-full bg-[#D9D9D9]"
        ></div>
      </div>
      <div className="w-full flex flex-row gap-3 px-5 pt-3">
        <button
        type="button"
          className="flex-1
                h-[44px] rounded-[10px] 
                bg-[#43BB6B] text-[#FCFFFF] text-center font-pretendard text-sm font-bold leading-7"
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          로그인
        </button>
        <button
         type="button"
          className="flex-1
                h-[44px] rounded-[10px]
                bg-[#43BB6B] text-[#FCFFFF] text-center font-pretendard text-sm font-bold leading-7"
          onClick={() => {
            navigate("/auth/signup");
          }}
        >
          회원가입
        </button>
      </div>
      <div className="w-full flex justify-center p-4">
        <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">
          계정이 기억나지 않나요?&nbsp;
        </span>
        <span className="text-[#000] text-center font-pretendard text-sm font-bold leading-7">
          계정 찾기
        </span>
      </div>
    </div>
  );
};

export default LandingPage;
