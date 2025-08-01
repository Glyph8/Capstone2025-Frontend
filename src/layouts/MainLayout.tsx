import { Outlet } from "react-router-dom";
import LowerNav from "../components/LowerNav.tsx";
import ChatBotButton from "../components/ChatBotButton.tsx";
import ChatBotFrame from "../pages/chatbot/ChatBotFrame.tsx";
import { useChatBotPageStore, useAddTimeTableStore } from "../store/store.ts";
import EditTableFrame from "../pages/timetable/EditTableFrame.tsx";

const MainLayout = () => {
    const { isChatBotOpen } = useChatBotPageStore();
    const { isEditing } = useAddTimeTableStore();
    return (
        <div className="flex flex-col justify-between w-full h-[100vh]">
            <main className="w-full h-[calc(100vh-64px)] bg-[#f6f6f6] overflow-hidden overflow-y-auto no-scrollbar">
                <Outlet /> {/* 캘린더, 시간표, 리뷰, 마이페이지 등 등이 여기에 렌더링됨 */}

                {isEditing ? <EditTableFrame /> :
                    <>
                        <ChatBotButton />
                        {isChatBotOpen ? <ChatBotFrame /> : null}
                    </>}

               
                {/* {isEditing ? <EditTableFrame /> :
                    <>
                        <ChatBotButton />
                        {isChatBotOpen ? <ChatBotFrame /> : null}
                        <LowerNav />
                    </>} */}
            </main>
             <LowerNav />
        </div>
    )
}
export default MainLayout;