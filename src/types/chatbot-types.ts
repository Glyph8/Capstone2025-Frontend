// 챗봇 페이지 on/off 상태
export interface ChatBotPageState {
    isChatBotOpen: boolean;
    openChatBotPage: () => void;
}

export type ContextType =
    | { type: 'user'; message: string }
    | { type: 'bot'; answer: string; recommendedProgramList?: RecommendedProgram[] };

export interface RecommendedProgram {
    title: string;
    url: string;
    applicationPeriod: string;
    targetAudience: string;
    selectionMethod: string;
    duration: string;
    purposeOfTheActivity: string;
    participationBenefitsAndExpectedOutcomes: string;
    process: string;
    modeOfOperation: string;
}