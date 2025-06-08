import { useState } from "react";
import { useChatBotPageStore } from "../../store/store.ts"
import BotSpeechBubble from "./BotSpeechBubble.tsx";
import UserSpeechBubble from "./UserSpeechBubble.tsx";
import { sendQuestionDummy } from "../../apis/chatbot.ts";
import type { ContextType } from "../../types/types.ts";

const ChatBotFrame = () => {
    const { openChatBotPage } = useChatBotPageStore();
    const [userQuestion, setUserQuestion] = useState('');

    const [contexts, setContexts] = useState<ContextType[]>([]);

    const handleUserQuestion = () => {
        const userContext: ContextType = { type: 'user', message: userQuestion };
        const botResponse = sendQuestionDummy(userQuestion);
        const botContext: ContextType = {
            type: 'bot',
            answer: botResponse.answer,
            recommendedProgramList: botResponse.recommendedProgramList,
        };
        setContexts((prev) => [...prev, userContext, botContext]);
        setUserQuestion('');
    };

    return (

        <div className="absolute bottom-0 w-97 h-194 
                    p-7 flex flex-col justify-end items-center overflow-y-scroll no-scrollbar
                    gap-y-3.5 z-20 bg-[#DDE9F6]">

            <div className="absolute top-5 right-5"
                onClick={openChatBotPage}>
                <img src="/icons/X-icon.svg" />
            </div>

            <div className="flex flex-col justify-center items-center">
                <div className="w-32 h-10 text-center justify-center text-[#0076FE] text-xs font-normal font-['Pretendard'] leading-normal tracking-wide">2025년 6월 11일</div>
                <div className="w-72 h-0 outline-1 outline-offset-[-0.50px] outline-[#0076FE]"></div>
            </div>

            <div className="space-y-4">
                {contexts.map((context, index) => {
                    if (context.type === 'user') {
                        return <UserSpeechBubble key={index} text={context.message} />;
                    } else {
                        return (
                            <BotSpeechBubble
                                key={index}
                                text={context.answer}
                                recommendedProgramList={context.recommendedProgramList}
                            />
                        );
                    }
                })}
            </div>


            <div>
                <div className="flex flex-row justify-between w-92 h-11 bg-[#0076FE] text-[#FCFFFF] rounded-[500px] m-4 pl-4">
                    <input id="textM" className="w-full"
                        placeholder="챗봇에게 비교과에 대해 물어보세요"
                        onChange={(e) => {
                            setUserQuestion(e.target.value)
                        }} />

                    <div className="w-10 h-10 bg-[#FCFFFF] rounded-[500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.30)] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] inline-flex justify-center items-center overflow-hidden m-1">
                        <div className="p-4 flex justify-center items-center">
                            <button className="w-6 h-6"
                                onClick={() => {
                                    handleUserQuestion()
                                }}>
                                <img className="w-6 h-6"
                                    src="/icons/blue-sending-icon.svg" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChatBotFrame;