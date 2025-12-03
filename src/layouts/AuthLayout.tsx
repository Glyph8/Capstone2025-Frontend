import { Outlet, useLocation } from "react-router-dom";
import UpperNav from "../components/UpperNav";

const AuthLayout = () => {
    const location = useLocation();
    return (
        <div className="flex flex-col max-w-200 mx-auto h-dvh">
            {location.pathname === "/auth" ? (
                null
            ) : (
                (location.pathname === "/auth/login") ? (
                <UpperNav text="로그인" otherBtn="None" />
                ) : (
                    <UpperNav text="회원가입" otherBtn="None" />
                )
            )}
            <main className="flex-1 flex flex-col w-full bg-[#ffffff]">
                <Outlet />
            </main>
        </div>
    )
}
export default AuthLayout;

