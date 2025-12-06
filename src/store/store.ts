import type { LookupTimetableResponse, MakeMemberTimetableRequest } from '@/generated-api/Api';
import type { ChatBotPageState } from '@/types/chatbot-types';
import type { AddTimeTableState,LoadTableState} from '@/types/timetable-types';
import { updateTimetable } from '@/utils/timetableUtils';
import { create } from 'zustand'


export const useChatBotPageStore = create<ChatBotPageState>()((set) => ({
    isChatBotOpen: false,
    pendingMessage: null, // 초기값 null
    openChatBotPage: () => set(() => ({ isChatBotOpen: true })), // !state.isChatBotOpen 대신 true로 명시적 오픈 권장
    closeChatBotPage: () => set(() => ({ isChatBotOpen: false })), // 닫기 기능이 필요할 경우
    // 기존 토글 기능 유지하려면 아래처럼
    // openChatBotPage: () => set((state) => ({ isChatBotOpen: !state.isChatBotOpen })),
    
    setPendingMessage: (msg) => set(() => ({ pendingMessage: msg })), // 구현
}));

export const useAddTimeTableStore = create<AddTimeTableState>()((set) => ({
    isEditing: false,
    setToggle : () => set((state) => ({ isEditing: !state.isEditing })),
    setIsEditing: (v) => set(() => ({ isEditing: v })),
}));


export interface SelectedCellState {
  selectedCell: MakeMemberTimetableRequest[];
  selectedExistingEvent: LookupTimetableResponse | null;
  updateCell: (cell: MakeMemberTimetableRequest) => void;
  clearCells: () => void;
  setCells: (cells: MakeMemberTimetableRequest[]) => void; 
  setSelectedExistingEvent: (event: LookupTimetableResponse | null) => void;
}

export const useSelectCellStore = create<SelectedCellState>()((set) => ({
  selectedCell: [],
  selectedExistingEvent: null,

  updateCell: (cellToUpdate: MakeMemberTimetableRequest) =>
    set((state) => ({
      selectedCell: updateTimetable(state.selectedCell, cellToUpdate),
    })),

  clearCells: () => set({ selectedCell: [] }),

  setCells: (cells: MakeMemberTimetableRequest[]) => set({ selectedCell: cells }),
  
  setSelectedExistingEvent: (event) => set({ selectedExistingEvent: event }),
}));

export const useLoadTableStore = create<LoadTableState>()((set) => ({
    loadTable: [],
    setLoadTable: (tables) => set(() => ({
        loadTable: [...tables]
    })),

    addNewLoadTable: (newEvent) => set((state) => ({
        loadTable: [...state.loadTable, newEvent]
    }))
}))

