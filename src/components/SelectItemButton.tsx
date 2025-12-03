type SelectItemButtonProps = {
    text: string;
    isSelected: boolean; 
    handleClick: () => void;
}

const SelectItemButton = ({ text, isSelected, handleClick }: SelectItemButtonProps) => {

    return (
        <div className="w-full">
            <div 
                onClick={handleClick}
                className={`flex flex-col w-full h-11 rounded-2xl text-center justify-center items-center text-lg font-normal font-['Pretendard'] leading-7 cursor-pointer transition-all
                    ${isSelected 
                        ? "bg-neutral-100 text-[#005B3F]" 
                        : "bg-white text-[#005B3F] shadow-[1px_1px_4px_2px_rgba(245,245,245,1.00)]" // 선택 안 되었을 때 스타일
                    }`
                }
            >
                {text}
            </div>
        </div>
    )
}

export default SelectItemButton;