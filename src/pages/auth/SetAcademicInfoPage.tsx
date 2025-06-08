import { useState } from "react";
import UpperNav from "../../components/UpperNav";
import WideAcceptButton from "../../components/WideAcceptButton";
import SelectItemButton from "../../components/SelectItemButton";
import TextInputForm from "../../components/TextInputForm";
import { enrollAcademicInfo } from "../../apis/auth";
import type { AcademicInfo } from "../../types/types";
import { useNavigate } from "react-router-dom";

const SetAcademicInfoPage = () => {
    const navigate = useNavigate()

    const [isAllReady, setIsAllReady] = useState(true);

    const [userAcademicStatus, setUserAcademicStatus] = useState("ENROLLED");
    const [userGrade, setUserGrade] = useState(1);
    const [userCollege, setUserCollege] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userName, setUserName] = useState('');

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
        <div className="flex flex-col justify-between items-center">

            <UpperNav text="회원가입" otherBtn="None" />

            <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">재학 상태</div>
            <div className="flex flex-row ">
                <SelectItemButton text="재학" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
                <SelectItemButton text="휴학" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
                <SelectItemButton text="졸업" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
            </div>

            <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">학년</div>

            <div className="flex flex-row ">

                <SelectItemButton text="1학년" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
                <SelectItemButton text="2학년" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
                <SelectItemButton text="3학년" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
                <SelectItemButton text="4학년" handleClick={function (): void {
                    throw new Error("Function not implemented.");
                }} />
            </div>

            <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">단과 대학</div>

            <TextInputForm label={"단과대학"} isError={false} isPW={false} handleChange={setUserCollege} />

            <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">학과</div>
            <TextInputForm label={"학과"} isError={false} isPW={false} handleChange={setUserDepartment} />
            <div className="w-28 h-12 text-center justify-start text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">이름</div>
            <TextInputForm label={"이름"} isError={false} isPW={false} handleChange={setUserName} />

            <WideAcceptButton text="가입 완료" isClickable={isAllReady} handleClick={completeSign} />
        </div>
    )
}

export default SetAcademicInfoPage;