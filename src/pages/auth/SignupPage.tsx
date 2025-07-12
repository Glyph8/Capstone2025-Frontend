import TextInputForm from "../../components/TextInputForm.tsx";
import WideAcceptButton from "../../components/WideAcceptButton.tsx";
import SetPassword from "./SetPassword.tsx";
import { useState } from "react";
import { sendMailRequest, verifyAuthCode } from "../../apis/auth.ts";

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [isSendMail, setIsSendMail] = useState(false);
    const [verifyCode, setVerifyCode] = useState('')
    const [isVerifyed, setIsVerifyed] = useState(false);

    const requestMail = async (email: string) => {
        const mailResult = sendMailRequest(email);
        setIsSendMail(await mailResult);
    }

    const verifyByCode = async (email: string, code: string) => {
        setIsVerifyed(true)

        const codeResult = verifyAuthCode(email, code);
        if (!await codeResult) {
            console.error();

        }
        else if (await codeResult) {
            localStorage.setItem("access-token", await codeResult)
            setIsVerifyed(true)
        }

    }
    return (
        <div className="w-full flex flex-col justify-center items-center">

            <div>
                <nav className="flex flex-col justify-start items-start mt-8">
                    <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                        회원가입
                    </div>
                    <div className="w-full h-8 text-black text-base font-medium font-['Pretendard'] leading-7">
                        건국대학교 메일 계정으로 인증해주세요
                    </div>
                </nav>

                <div className="w-full flex flex-col justify-center items-center mt-12">
                    <TextInputForm label="이메일" placeholder="konkuk@konkuk.ac.kr" isError={false} isPW={false} handleChange={setEmail} />
                </div>
            </div>

            {!isSendMail ? (
                <div className="mt-6">
                    <WideAcceptButton text="인증 메일 요청" isClickable={true} handleClick={() => {
                        requestMail(email)
                    }} />
                </div>
            ) : (

                <div className="w-full flex flex-col justify-center items-center mt-6">
                    <TextInputForm label="인증번호" placeholder="" isError={false} isPW={false} handleChange={setVerifyCode} />

                    {isVerifyed ? (
                        <SetPassword />
                    ) :

                        <>
                            <WideAcceptButton text="인증하기" isClickable={true} handleClick={() => {
                                verifyByCode(email, verifyCode);
                            }} />

                            <div className="w-60 h-7 text-center justify-start mt-6 mb-6">
                                <span className="text-black text-xs font-medium font-['Pretendard'] leading-7">
                                    인증 메일을 받지 못하셨나요?
                                </span>
                                <span className="text-black text-xs font-semibold font-['Pretendard'] leading-7">
                                    &nbsp; | &nbsp;
                                </span>
                                <span className="text-[#08AC64] text-xs font-semibold font-['Pretendard'] leading-7"
                                    onClick={() => requestMail(email)}>
                                    다시 보내기
                                </span>
                            </div>
                        </>}
                </div>

            )

            }

            {/* {isVerifyed ? (
                <SetPassword />
            ) : null} */}
        </div>
    )
}

export default SignupPage