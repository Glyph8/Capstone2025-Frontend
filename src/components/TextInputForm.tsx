
type TextInputFormProps = {
    label?: string;
    placeholder?: string;
    isError: boolean;
    isPW: boolean;
    handleChange: (inputText:string)=>void;
}

const TextInputForm = ({ label, placeholder, isError, isPW, handleChange }: TextInputFormProps) => {
    return (
        <form>
            {/* input label */}
            <div className="w-full h-6 text-left justify-start text-black text-xs font-light font-['Pretendard'] leading-7">{label}</div>

            {/* 비밀번호 입력 구분 */}
            {!isPW ?
                (
                    <input className="w-full text-black text-sm font-medium font-['Pretendard'] leading-7" placeholder={placeholder} 
                    onChange={(e)=>handleChange(e.target.value)}/>
                )
                :
                <input className="text-black text-sm font-medium font-['Pretendard'] leading-7" placeholder={placeholder} 
                onChange={(e)=>handleChange(e.target.value)}/>
            }
            {/* input 아래 초록/빨강 바 */}
            {!isError ? <div className="w-72 h-0 outline-1 outline-offset-[-0.50px] outline-emerald-600"></div>
                : <div className="w-72 h-0 outline-1 outline-offset-[-0.50px] outline-red-700"></div>}

        </form>
    )
}

export default TextInputForm