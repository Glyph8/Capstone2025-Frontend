import { Outlet, useLocation } from "react-router-dom";
import UpperNav from "../components/UpperNav";

const AuthLayout = () => {
    const location = useLocation();
    return (
        <>
            {location.pathname === "/auth" ? (
                null
            ) : (
                (location.pathname === "/auth/login") ? (
                <UpperNav text="로그인" otherBtn="None" />
                ) : (
                    <UpperNav text="회원가입" otherBtn="None" />
                )
            )}
            <main className="flex flex-col w-full h-full bg-[#ffffff]">
                <Outlet /> {/* LoginPage, SignupPage 등이 여기에 렌더링됨 */}
            </main>
        </>
    )
}
export default AuthLayout;

