import { Outlet } from "react-router-dom";
import LowerNav from "../components/LowerNav.tsx";
import ChatBotButton from "../components/ChatBotButton.tsx";
import ChatBotFrame from "../pages/chatbot/ChatBotFrame.tsx";
import { useChatBotPageStore } from "../store/store.ts";

const MainLayout = () => {
  const { isChatBotOpen } = useChatBotPageStore();
  return (
   <div className="flex flex-col justify-between w-full h-dvh">
      <main className="relative flex-1 w-full bg-white overflow-hidden overflow-y-auto no-scrollbar">
        <Outlet />
        <ChatBotButton />
        {isChatBotOpen ? <ChatBotFrame /> : null}
      </main>
      <LowerNav />
    </div>
  );
};
export default MainLayout;
