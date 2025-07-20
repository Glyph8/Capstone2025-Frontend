import UpperNav from "../../components/UpperNav";

const MyPage = () => {
    return (
        <div className="w-full h-full">
            <UpperNav text="회원정보" />
            <div className="bg-white">
                <nav className="flex flex-col justify-start items-start mt-8">
                    <div className="w-full h-12 text-Schemes-On-Surface text-xl font-semibold font-['Pretendard'] leading-7">
                        회원가입
                    </div>
                    <div className="w-full h-8 text-black text-base font-medium font-['Pretendard'] leading-7">
                        건국대학교 메일 계정으로 인증해주세요
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default MyPage;