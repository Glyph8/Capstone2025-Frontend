import TextInputForm from "../../components/TextInputForm.tsx";
import WideAcceptButton from "../../components/WideAcceptButton.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
    const navigate = useNavigate()
    const loginRequest = () => {
        alert(`
            EMAIL : ${email}
            PW : ${pw}
            `)
        navigate('/main/timetable')
    }
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <nav className="flex flex-col justify-start items-start mt-8">
                <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    로그인
                </div>
                <div className="w-full h-8 text-black text-base font-medium font-['Pretendard'] leading-7">
                    건국대학교 이메일 계정으로 로그인 해주세요.
                </div>
            </nav>

            <div className="w-full flex flex-col justify-center items-center mt-12">
                <TextInputForm label="이메일" placeholder="konkuk@konkuk.ac.kr" isError={false} isPW={false} handleChange={setEmail} />
                <TextInputForm label="비밀번호" placeholder="* * * *" isError={false} isPW={true} handleChange={setPw} />
            </div>


            <div className="flex justify-center mt-12">
                <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">
                    비밀번호를 잊어버렸어요
                </span>
                <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7">
                    &nbsp; | &nbsp;
                </span>
                <span className="text-[#000] text-center font-pretendard text-sm font-normal leading-7"
                    onClick={() => {
                        navigate('/auth/signup')
                    }}>
                    새로 가입하고 싶어요
                </span>
            </div>

            <div className="absolute bottom-22">
                <WideAcceptButton text="로그인" isClickable={true} handleClick={loginRequest} />
            </div>

        </div>
    )
}

export default LoginPage