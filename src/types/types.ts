
export interface AcademicInfo{
  academicStatus: "ENROLLED" | "LEAVE_OF_ABSENCE" |  "GRADUATED",
  grade: number,
  college: string,
  department: string,
  name: string
}

export type dayString = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// 챗봇 페이지 on/off 상태
export interface ChatBotPageState {
    isChatBotOpen: boolean;
    openChatBotPage: () => void;
}

// 시간표 추가 UI on / off 상태
export interface AddTimeTableState {
    isEditing: boolean;
    setIsEditing: () => void;
}

// 셀 클릭 시 전달할 정보를 담는 type - Event 기반으로 수정 필요.
export interface selectedTime {
    // day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    day: dayString;
    startTime: string;
    endTime: string;
}

// 시간표에서 클릭한 셀들 정보를 모으는 상태
export interface SelectedCellState {
    selectedCell: selectedTime[];
    setSelectedCell: (newCell: selectedTime[]) => void;
}

export interface addTimeRequest {
    selectedCell: selectedTime[];
    eventName: string;
    eventDetail: string;
    color: string;
}

// 서버에서 가져온 시간표 정보를 저장하는 상태
export interface LoadTableState {
    loadTable: Event[];
    setLoadTable: (newTable: Event[]) => void;
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


// 중첩 map으로 시간표 작성하는 경우 type - deprecated..
export interface timeCell {
    day: string; //필수, 디폴트 설정⭕
    startTime: string;//필수, 디폴트 설정⭕
    endTime: string;//필수, 디폴트 설정⭕

    eventName: string; //옵션, 디폴트 설정❌ ""? None?
    eventDetail: string;//옵션, 디폴트 설정❌
    color: string; //필수, 디폴트 설정⭕ #f5f5f5
    isSelected: boolean; //필수, 디폴트 설정⭕ false
    isHead: boolean;

    head: string; // 굳이 필요한가? 앞 셀의 endtime과 내 starttime을 비교하면 안되나.
    // 그럼 어떻게 앞 뒤 셀이 서로 비교해볼 수 있나?
    // map 반복할 때 앞 index를 참고?
    // 그 경우 2번째 셀의 endTime은 뭘 가리켜야하는가?
    // 매번 비교하는게 과연 좋은 방법인가?
    // 그냥 isSequence, isHead 처럼 단일 셀인지 병합 셀인지 구분?
    // 하이브리드로, 먼저 isSequence로 
    tail: string;
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