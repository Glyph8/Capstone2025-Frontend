import { useState } from "react";
import WideAcceptButton from "../../components/WideAcceptButton";
import SelectItemButton from "../../components/SelectItemButton";
import TextInputForm from "../../components/TextInputForm";
import { enrollAcademicInfo } from "../../apis/auth";

import { useNavigate } from "react-router-dom";
import type { AcademicInfo } from "@/types/auth-types";
import toast from "react-hot-toast";
import UpperNav from "@/components/UpperNav";

const UpdateAcademicInfoPage = () => {
    const navigate = useNavigate()

    const [userAcademicStatus, setUserAcademicStatus] = useState("ENROLLED");
    const [userGrade, setUserGrade] = useState(1);
    const [userCollege, setUserCollege] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userName, setUserName] = useState('');

    const completeSign = async () => {
        const academicInfo = {
            academicStatus: userAcademicStatus,
            grade: userGrade,
            college: userCollege,
            department: userDepartment,
            name: userName,
        }
        try {
            const finalResult = await enrollAcademicInfo(academicInfo as AcademicInfo);
            if (finalResult)
                navigate('/main/mypage/profile')
            else
                console.log("try 성공, result false")
        }
        catch {
            toast.error("compleSign 요청 에러 발생")
        }
    }

    return (
        <div className="flex flex-col justify-between items-center ml-auto mr-auto w-full ">
            <UpperNav text="학적 정보 수정" />
            
            <div className="w-full mt-8 px-5">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    재학 상태
                </div>
                <div className="flex flex-row justify-start gap-4">
                    <SelectItemButton 
                        text="재학" 
                        isSelected={userAcademicStatus === "ENROLLED"} 
                        handleClick={() => setUserAcademicStatus("ENROLLED")} 
                    />
                    <SelectItemButton 
                        text="휴학" 
                        isSelected={userAcademicStatus === "LEAVE_OF_ABSENCE"} 
                        handleClick={() => setUserAcademicStatus("LEAVE_OF_ABSENCE")} 
                    />
                    <SelectItemButton 
                        text="졸업" 
                        isSelected={userAcademicStatus === "GRADUATED"} 
                        handleClick={() => setUserAcademicStatus("GRADUATED")} 
                    />
                </div>
            </div>

            <div className="w-full mt-9 px-5">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    학년
                </div>
                <div className="flex flex-row w-full gap-2">
                    <SelectItemButton 
                        text="1학년" 
                        isSelected={userGrade === 1} 
                        handleClick={() => setUserGrade(1)} 
                    />
                    <SelectItemButton 
                        text="2학년" 
                        isSelected={userGrade === 2} 
                        handleClick={() => setUserGrade(2)} 
                    />
                    <SelectItemButton 
                        text="3학년" 
                        isSelected={userGrade === 3} 
                        handleClick={() => setUserGrade(3)} 
                    />
                    <SelectItemButton 
                        text="4학년" 
                        isSelected={userGrade === 4} 
                        handleClick={() => setUserGrade(4)} 
                    />
                </div>
            </div>

            <div className="px-5 w-full flex flex-col justify-center mt-9">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    단과 대학
                </div>
                <TextInputForm label="소속 단과대학을 입력해주세요" placeholder="예 : 공과대학" isError={false} isPW={false} data={userCollege} handleChange={setUserCollege} />
            </div>

            <div className="w-full mt-9 px-5">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    학과
                </div>
                <TextInputForm label="소속 학과를 입력해주세요" placeholder="예: 컴퓨터공학부" isError={false} isPW={false} data={userDepartment} handleChange={setUserDepartment} />
            </div>

            <div className="w-full mt-9 px-5">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    이름
                </div>
                <TextInputForm label="챗봇에게 불릴 이름을 입력해주세요." placeholder="예: 김건국" isError={false} isPW={false} data={userName} handleChange={setUserName} />
            </div>

            <div className="mt-6 py-5 px-5">
                <WideAcceptButton text="변경 사항 저장하기" isClickable={true} handleClick={completeSign} />
            </div>
        </div>
    )
}

export default UpdateAcademicInfoPage;