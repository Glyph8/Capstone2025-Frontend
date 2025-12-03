import type { InputHTMLAttributes } from "react";

type TextInputFormProps = {
    label?: string;
    isError: boolean;
    isPW: boolean;
    data: string;
    handleChange: (inputText:string)=>void;
}& InputHTMLAttributes<HTMLInputElement>;

const TextInputForm = ({ label, isError, isPW, data, handleChange,  ...rest }: TextInputFormProps) => {
    const inputType = isPW ? "password" : "text";

    return (
        <div className="w-full">
            {/* input label */}
            <div className="w-full h-6 text-left justify-start text-black text-xs font-light font-['Pretendard'] leading-7">
                <label htmlFor={rest.id || rest.name}>
                    {label}
                    </label>
            </div>

            {/* 비밀번호 입력 구분 */}
             <input 
                className="w-full text-black text-sm font-medium font-['Pretendard'] leading-7"
                type={inputType} // type을 동적으로 할당
                value={data} // value가 항상 존재하도록 보장
                onChange={(e) => handleChange(e.target.value)}
                {...rest}
            />
            {/* input 아래 초록/빨강 바 */}
            {!isError ? <div className="w-full h-0 outline-1 outline-offset-[-0.50px] outline-emerald-600"></div>
                : <div className="w-full h-0 outline-1 outline-offset-[-0.50px] outline-red-700"></div>}

        </div>
    )
}

export default TextInputForm