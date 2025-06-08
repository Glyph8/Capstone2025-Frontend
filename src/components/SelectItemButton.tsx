import { useState } from "react";

type SelectItemButtonProps = {
    text: string;
    handleClick: () => void;
}

const SelectItemButton = ({ text, handleClick }: SelectItemButtonProps) => {
    const [isSelected, setIsSelected] = useState(false);
    return (
        <>
            {isSelected ?
                <div className="flex flex-col w-25 h-11 bg-neutral-100 rounded-2xl 
                text-center justify-center items-center
                text-[#005B3F] text-lg font-normal font-['Pretendard'] leading-7"
                    onClick={() => {
                        handleClick()
                        setIsSelected(!isSelected)
                    }}>
                    {text}
                </div>
                : <div className="flex flex-col w-25 h-11 bg-white rounded-2xl shadow-[1px_1px_4px_2px_rgba(245,245,245,1.00)] 
                text-center justify-center items-center
                text-[#005B3F] text-lg font-normal font-['Pretendard'] leading-7"
                    onClick={() => {
                        handleClick()
                        setIsSelected(!isSelected)
                    }}>
                    {text}
                </div>}
        </>
    )
}

export default SelectItemButton
