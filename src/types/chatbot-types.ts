import type { Program } from "@/generated-api/Api";

// 챗봇 페이지 on/off 상태
export interface ChatBotPageState {
    isChatBotOpen: boolean;
    pendingMessage: string | null; // 추가됨
    openChatBotPage: () => void;
    closeChatBotPage: () => void;  // [NEW] 닫기 함수 타입 추가
    setPendingMessage: (msg: string | null) => void; // 추가됨
}
export type ContextType =
    | { type: 'user'; message: string }
    | { type: 'bot'; answer: string; recommendedProgramList?: Program[] }
    | {type: 'loading';}

