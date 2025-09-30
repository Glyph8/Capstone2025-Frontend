import { useState, useRef, useEffect } from "react";
import { useChatBotPageStore } from "../../store/store.ts";
import BotSpeechBubble from "./BotSpeechBubble.tsx";
import UserSpeechBubble from "./UserSpeechBubble.tsx";
import { registerUserToChatbot, sendUserQuestion } from "../../apis/chatbot.ts";
import type { ContextType } from "@/types/chatbot-types.ts";
import AnswerLoadingBubble from "./AnswerLoadingBubble.tsx";

const ChatBotFrame = () => {
  const { openChatBotPage } = useChatBotPageStore();
  const [userQuestion, setUserQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const [contexts, setContexts] = useState<ContextType[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [contexts]);

  const handleUserQuestion = async () => {
    const trimmed = userQuestion.trim();
    if (!trimmed) return;

    const userContext: ContextType = { type: "user", message: trimmed };
    const loadingContext: ContextType = { type: 'loading' };

    setContexts((prev) => [...prev, userContext, loadingContext]);
    setUserQuestion("");

    try {
      const botResponse = await sendUserQuestion(trimmed);

      if (botResponse?.answer && botResponse.sources) {
        const botContext: ContextType = {
          type: "bot",
          answer: botResponse.answer,
          recommendedProgramList: botResponse.sources,
        };
        setContexts((prev) => [...prev.slice(0, -1), botContext]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to get bot response:", error);
      const errorContext: ContextType = {
          type: 'bot',
          answer: '죄송합니다, 답변을 가져오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };
      setContexts((prev) => [...prev.slice(0, -1), errorContext]);
    }

    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(()=>{
     console.log("챗봇 마운트?")
    const process = async () =>{
        const result = await registerUserToChatbot()
        console.log("챗봇 마운트", result)
    }
    process();
  }, [])

  return (
<div
      className="absolute bottom-0 w-full h-screen
                 flex flex-col z-20 bg-[#DDE9F6]"
    >
      <div className="flex-shrink-0">
        <div className="absolute top-5 right-5 cursor-pointer" onClick={openChatBotPage}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="w-full flex flex-col justify-center items-center mt-12 mb-4">
          <div className="w-full h-10 text-center justify-center text-[#0076FE] text-xs font-normal font-['Pretendard'] leading-normal tracking-wide">
            {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
          </div>
          <div className="w-[70%] border-t border-[#0076FE]"></div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 pb-4 space-y-4"
      >
        {contexts.map((context, index) => {
          if (context.type === "user") {
            return <UserSpeechBubble key={index} text={context.message} />;
          } else if (context.type === "bot") {
            return (
              <BotSpeechBubble
                key={index}
                text={context.answer}
                recommendedProgramList={context.recommendedProgramList}
              />
            );
          } else {
            return <AnswerLoadingBubble key={index} />;
          }
        })}
      </div>

      <div className="flex-shrink-0 p-4 bg-[#DDE9F6]">
        <div className="flex flex-row justify-between w-full h-11 bg-white text-gray-800 rounded-[500px] shadow-md pl-5 pr-1.5 py-1.5 items-center">
          <input
            id="textM"
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
            placeholder="챗봇에게 비교과에 대해 물어보세요"
            ref={inputRef}
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUserQuestion();
              }
            }}
          />
          <button
            className="flex-shrink-0 w-8 h-8 bg-[#0076FE] rounded-full shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] inline-flex justify-center items-center overflow-hidden disabled:opacity-50"
            onClick={handleUserQuestion}
            disabled={!userQuestion.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotFrame;
