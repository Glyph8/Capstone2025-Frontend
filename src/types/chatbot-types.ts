import type { Program } from "@/generated-api/Api";

// 챗봇 페이지 on/off 상태
export interface ChatBotPageState {
    isChatBotOpen: boolean;
    openChatBotPage: () => void;
}

export type ContextType =
    | { type: 'user'; message: string }
    | { type: 'bot'; answer: string; recommendedProgramList?: Program[] }
    | {type: 'loading';}

