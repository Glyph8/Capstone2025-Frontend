import TextInputForm from "../../components/TextInputForm.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginRequest } from "../../apis/auth.ts";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginRequest(email, password)
      .then((res) => {
        // 에러 응답이 와도 main 진입하는 문제 해결 필요
        console.log("로그인 성공 res : ", res);
        if (res) navigate("/main/timetable");
        else toast.error("로그인에서 문제 발생. 토큰 관련 오류 추정");
      })
      .catch((err) =>
        toast.error(
          `login 실패 Error : ${err}`
        )
      );
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="w-full flex flex-col justify-start items-center px-5"
      onSubmit={login}
    >
      <nav className="w-full flex flex-col justify-start items-start mt-8">
        <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
          로그인
        </div>
        <div className="w-full h-8 text-black text-base font-medium font-['Pretendard'] leading-7">
          건국대학교 이메일 계정으로 로그인 해주세요.
        </div>
      </nav>

      <div className="w-full flex flex-col justify-center items-center mt-12">
        <TextInputForm
          label="이메일"
          placeholder="konkuk@konkuk.ac.kr"
          isError={false}
          isPW={false}
          data={email}
          handleChange={setEmail}
          autoComplete="email"
          id="email"
          name="email"
        />
        <TextInputForm
          label="비밀번호"
          placeholder="* * * *"
          isError={false}
          isPW={true}
          data={password}
          handleChange={setPassword}
          autoComplete="current-password"
          id="password"
          name="password"
        />
      </div>

      <div className="flex justify-center mt-12">
        <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">
          비밀번호를 잊어버렸어요
        </span>
        <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">
          &nbsp; | &nbsp;
        </span>
        <span
          className="text-[#000] text-center font-pretendard text-sm font-normal leading-7"
          onClick={() => {
            navigate("/auth/signup");
          }}
        >
          새로 가입하고 싶어요
        </span>
      </div>

      <div className="w-full flex justify-center mt-22">
        <button
          type="submit"
          className="w-[290px] h-[45px] rounded-[500px] bg-[#01A862] flex justify-center items-center"
        >
          <div className="w-full h-[27px] flex-shrink-0 text-[#FCFFFF] text-center text-[17px] not-italic font-medium leading-[28px]">
            로그인
          </div>
        </button>
      </div>
    </form>
  );
};

export default LoginPage;
