import type { LookupTimetableResponse, MakeMemberTimetableRequest } from '@/generated-api/Api';
import type { ChatBotPageState } from '@/types/chatbot-types';
import type { AddTimeTableState,LoadTableState} from '@/types/timetable-types';
import { updateTimetable } from '@/utils/timetableUtils';
import { create } from 'zustand'

export const useChatBotPageStore = create<ChatBotPageState>()((set) => ({
    isChatBotOpen: false,
    openChatBotPage: () => set((state) => ({ isChatBotOpen: !state.isChatBotOpen })),
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

