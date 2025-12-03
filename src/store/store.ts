import type { MakeMemberTimetableRequest } from '@/generated-api/Api';
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
  updateCell: (cell: MakeMemberTimetableRequest) => void;
  clearCells: () => void;
  // [추가] 여러 셀을 한 번에 설정하는 액션
  setCells: (cells: MakeMemberTimetableRequest[]) => void; 
}

export const useSelectCellStore = create<SelectedCellState>()((set) => ({
  selectedCell: [],
  
  updateCell: (cellToUpdate: MakeMemberTimetableRequest) =>
    set((state) => ({
      selectedCell: updateTimetable(state.selectedCell, cellToUpdate),
    })),

  clearCells: () => set({ selectedCell: [] }),

  // [추가] 배열을 통째로 받아 상태를 업데이트 (드래그 기능용)
  setCells: (cells: MakeMemberTimetableRequest[]) => set({ selectedCell: cells }),
}));

export const useLoadTableStore = create<LoadTableState>()((set) => ({
    // 현재 더미 데이터
    loadTable: [
        // {
        //     id: 'event-1',
        //     day: 'MON',
        //     startTime: '11:00',
        //     endTime: '1230',
        //     eventName: '주간 회의',
        //     eventDetail: '팀 전체 주간 목표 공유',
        //     color: '#D1E7DD', // 연한 녹색
        // },
        // {
        //     id: 'event-2',
        //     day: 'WED',
        //     startTime: '0900',
        //     endTime: '1030',
        //     eventName: '디자인 리뷰',
        //     eventDetail: '새로운 기능 UI/UX 검토fefaafaefaefefe',
        //     color: '#CFE2FF', // 연한 파랑
        // },
        // {
        //     id: 'event-3',
        //     day: 'FRI',
        //     startTime: '1300',
        //     endTime: '1430',
        //     eventName: '개인 프로젝트',
        //     eventDetail: '',
        //     color: '#FFF3CD', // 연한 노랑
        // },
    ],
    setLoadTable: (tables) => set(() => ({
        loadTable: [...tables]
    })),

    addNewLoadTable: (newEvent) => set((state) => ({
        loadTable: [...state.loadTable, newEvent]
    }))
}))
