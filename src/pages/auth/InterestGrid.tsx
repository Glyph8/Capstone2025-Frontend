import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import SelectItemButton from "../../components/SelectItemButton";

type InterestGridProps = {
    interests: string[]
    setInterests: (s: string[]) => void
}

const INITIAL_INTERESTS = ["학업", "취업", "웹개발", "프론트", "백엔드", "AI", "DB", "devOps", "마일리지"];

const InterestGrid = ({ interests, setInterests }: InterestGridProps) => {
    const [categories, setCategories] = useState<string[]>(INITIAL_INTERESTS);
    const [inputValue, setInputValue] = useState<string>("");

    // 선택/해제 로직
    const handleSelect = (item: string) => {
        if (interests.includes(item)) {
            setInterests(interests.filter((interest) => interest !== item));
        } else {
            setInterests([...interests, item]);
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleAddCategory = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const trimmedInput = inputValue.trim();

            if (!trimmedInput) return;
            if (categories.includes(trimmedInput)) {
                alert("이미 존재하는 카테고리입니다."); 
                setInputValue("");
                return;
            }

            // 1. 카테고리 목록에 추가
            setCategories((prev) => [...prev, trimmedInput]);
            // 2. 관심사 목록에 추가 (자동 선택)
            setInterests([...interests, trimmedInput]);
            // 3. 입력창 초기화
            setInputValue("");
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="w-full grid" style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
            }}>
                {categories.map((item) => {
                    const isSelected = interests.includes(item);
                    
                    return (
                        <SelectItemButton 
                            key={item} 
                            text={item} 
                            isSelected={isSelected} 
                            handleClick={() => handleSelect(item)} 
                        />
                    )
                })}
            </div>

            <div className="w-full flex flex-col gap-2">
                <span className="text-sm text-gray-500 font-medium px-1">직접 입력</span>
                <input 
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleAddCategory}
                    placeholder="태그를 입력하고 엔터를 누르세요"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Pretendard']"
                />
            </div>
        </div>
    )
}

export default InterestGrid;