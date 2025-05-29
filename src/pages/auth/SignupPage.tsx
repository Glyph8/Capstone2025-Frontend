import UpperNav from "../../components/UpperNav.tsx";
import TextInputForm from "../../components/TextInputForm.tsx";
import WideAcceptButton from "../../components/WideAcceptButton.tsx";
import SetPassword from "./SetPassword.tsx";
import { useState } from "react";

const SignupPage = () =>{
    const [isVerifyed, setIsVerifyed] = useState(false);
    const verifyByMail = () =>{
        setIsVerifyed(true)
        // if(true){
        //     setIsVerifyed(true)
        // }
        // else{
        //     setIsVerifyed(false)
        // }
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <UpperNav text="회원가입" otherBtn="None"/>

            <nav>
                <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">회원가입</div>
                <div className="w-96 h-8 text-center justify-start text-black text-base font-medium font-['Pretendard'] leading-7">건국대학교 메일 계정으로 인증해주세요</div>
            </nav>

            <TextInputForm label="이메일" placeholder="konkuk@konkuk.ac.kr" isError={false} isPW={false}/>
            <TextInputForm label="인증번호" placeholder="" isError={false} isPW={false}/>

            <WideAcceptButton text="인증하기" isClickable={true} handleClick={verifyByMail}/>
            <div className="w-60 h-7 text-center justify-start">
                <span className="text-black text-xs font-medium font-['Pretendard'] leading-7">
                    인증 메일을 받지 못하셨나요?
                </span>
                <span className="text-black text-xs font-semibold font-['Pretendard'] leading-7"> 
                    &nbsp; | &nbsp;
                </span>
                <span className="text-[#08AC64] text-xs font-semibold font-['Pretendard'] leading-7">
                            다시 보내기
                </span>
            </div>

            {isVerifyed ?(
                <SetPassword/>
            ) : null}
        </div>
    )
}

export default SignupPage