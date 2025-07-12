import { useState } from "react";
import WideAcceptButton from "../../components/WideAcceptButton";
import SelectItemButton from "../../components/SelectItemButton";
import TextInputForm from "../../components/TextInputForm";
import { enrollAcademicInfo } from "../../apis/auth";
import type { AcademicInfo } from "../../types/types";
import { useNavigate } from "react-router-dom";

const SetAcademicInfoPage = () => {
    const navigate = useNavigate()

    const [userAcademicStatus, setUserAcademicStatus] = useState("ENROLLED");
    const [userGrade, setUserGrade] = useState(1);
    const [userCollege, setUserCollege] = useState('전체대학');
    const [userDepartment, setUserDepartment] = useState('자유전공학부');
    const [userName, setUserName] = useState('김건국');

    const completeSign = () => {
        const academicInfo = {
            academicStatus: userAcademicStatus,
            grade: userGrade,
            college: userCollege,
            department: userDepartment,
            name: userName,
        }
        enrollAcademicInfo(academicInfo as AcademicInfo);
        navigate('/main/timetable')
    }


    return (
        <div className="flex flex-col justify-between items-center ml-auto mr-auto">

            <div className="w-full mt-8">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    재학 상태
                </div>
                <div className="flex flex-row justify-start gap-4">
                    <SelectItemButton text="재학" handleClick={() => setUserAcademicStatus("ENROLLED")} />
                    <SelectItemButton text="휴학" handleClick={() => setUserAcademicStatus("LEAVE_OF_ABSENCE")} />
                    <SelectItemButton text="졸업" handleClick={() => setUserAcademicStatus("GRADUATED")} />
                </div>
            </div>

            <div className="w-full mt-9">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    학년
                </div>
                <div className="flex flex-row w-full gap-2">
                    <SelectItemButton text="1학년" handleClick={() => setUserGrade(1)} />
                    <SelectItemButton text="2학년" handleClick={() => setUserGrade(2)} />
                    <SelectItemButton text="3학년" handleClick={() => setUserGrade(3)} />
                    <SelectItemButton text="4학년" handleClick={() => setUserGrade(4)} />
                </div>
            </div>

            <div className="w-full flex flex-col justify-center mt-9">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    단과 대학
                </div>
                <TextInputForm label="소속 단과대학을 입력해주세요" placeholder="예 : 공과대학" isError={false} isPW={false} handleChange={setUserCollege} />
            </div>

            <div className="w-full mt-9">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    학과
                </div>
                <TextInputForm label="소속 학과를 입력해주세요"placeholder="예: 컴퓨터공학부" isError={false} isPW={false} handleChange={setUserDepartment} />
            </div>

            <div className="w-full mt-9">
                <div className="w-28 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                    이름
                </div>
                <TextInputForm label="챗봇에게 불릴 이름을 입력해주세요." placeholder="예: 김건국" isError={false} isPW={false} handleChange={setUserName} />
            </div>

            <div className="absolute bottom-22">
                <WideAcceptButton text="가입 완료" isClickable={true} handleClick={completeSign} />
            </div>
        </div>
    )
}

export default SetAcademicInfoPage;