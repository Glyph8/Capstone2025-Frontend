import { useNavigate } from "react-router-dom";
import TextInputForm from "../../components/TextInputForm.tsx";
import WideAcceptButton from "../../components/WideAcceptButton.tsx";
import { useState } from "react";

const SetPassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [rePasswword, setRePassword] = useState('&nbsp');

    const confirmPW = () => {
        navigate('/auth/interest')
    }
    return (
        <div className="w-full flex flex-col justify-center items-center mt-10">
            <div>
                <div className="w-28 h-12 text-left justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    비밀번호 설정
                </div>

                <TextInputForm label="비밀번호" placeholder="" isError={false} isPW={true} handleChange={setPassword} />
                <TextInputForm label="비밀번호 재확인" placeholder="" isError={false} isPW={true} handleChange={setRePassword} />
            </div>
            <WideAcceptButton text="계속하기" isClickable={password === rePasswword} handleClick={confirmPW} />

        </div>
    )
}

export default SetPassword