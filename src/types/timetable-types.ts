import type { LookupTimetableResponse, MakeMemberTimetableRequest } from "@/generated-api/Api";

export type dayString = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// 시간표 추가 UI on / off 상태
export interface AddTimeTableState {
    isEditing: boolean;
    setIsEditing: () => void;
}

// 셀 클릭 시 전달할 정보를 담는 type - Event 기반으로 수정 필요.
export interface SelectedTime {
    // day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    day: dayString;
    startTime: string;
    endTime: string;
}

// 시간표에서 클릭한 셀들 정보를 모으는 상태
// export interface SelectedCellState {
// interface SelectedCellState {
//     // selectedCell: SelectedTime[];
//     selectedCell: MakeMemberTimetableRequest[];
//     setSelectedCell: (newCell: MakeMemberTimetableRequest[]) => void;
// }

export interface AddTimeRequest {
    selectedCell: MakeMemberTimetableRequest[];
    eventName: string;
    eventDetail: string;
    color: string;
}

// 서버에서 가져온 시간표 정보를 저장하는 상태
export interface LoadTableState {
    loadTable: LookupTimetableResponse[];
    setLoadTable: (newTable: LookupTimetableResponse[]) => void;
    addNewLoadTable: (newTable: LookupTimetableResponse) => void;
}

export interface Preset {
    id: string;
    eventName: string;
    eventDetail: string;
    color: string;
}

export interface PresetState {
    presets: Preset[];
    setPresets: (newPresets: Preset[]) => void;
}

// 베이스 시간표 위에 그려질 일정들 정보 type
export interface Event {
    id: string; // 각 일정을 구분할 고유 ID (uuid, nanoid 등 사용)
    // day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'; // 요일
    day: dayString;
    startTime: string; // "0900"
    endTime: string; // "1100" (30분 단위가 아닌, 끝나는 시간)
    eventName: string;
    eventDetail: string;
    color: string; // #B2CCFF 등
}

// Event마다 구분될 수 있도록 id 생성하는 함수, 중복 발생할경우 추후 uuid 등 도입
export function createEvent(event: Omit<Event, 'id'>): Event {
    return {
        ...event,
        id: `${event.day}_${event.startTime}`,
    };
}
