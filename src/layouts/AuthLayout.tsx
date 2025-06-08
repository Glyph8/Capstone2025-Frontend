import {Outlet} from "react-router-dom";

const AuthLayout = () =>{
    return(
        <>
            <main className="w-[390px] min-h-[844px] bg-[#ffffff]">
                <Outlet/> {/* LoginPage, SignupPage 등이 여기에 렌더링됨 */}
            </main>
        </>
    )
}
export default AuthLayout;

