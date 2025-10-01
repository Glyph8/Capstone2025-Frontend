import api from "@/apis/index"
// import { useLoadTableStore } from "../store/store";
import type { ChangeTimetableRequest, MakeMemberTimetableRequest } from "@/generated-api/Api";

export const getTimeTable = ()=> api.lookupTimetable()
    .then((res) => {
        console.log("시간표 조회 api", res);
        return res.data.result;
    })
    .catch((err) => console.error(err));


// 추가할 시간표 정보 보내기 POST
// 논의 추가 필요. 여러 요일, 여러 시간대 셀을 동시 클릭한 경우?
// 입력에 제한을 둘 것인지 api를 수정할 것인지.
export const sendEventRequest = (events:  MakeMemberTimetableRequest[]) => api.makeTimetable(events)
    .then(response => console.log("sendEventRequest 성공", response.data))
    .catch(error => console.error(error));


export const patchEvent = (ChangedEvent:ChangeTimetableRequest) => api.changeTimetable(ChangedEvent).then((res) => {
        console.log("시간표 내 이벤트 변경 api", res);
        return res.data.result; //boolean 값
    })


export const deleteEvent = (deleteTimetableId: number) => api.deleteTimetable({deleteTimetableId}).then((res) => {
// export const deleteEvent = (EventId:DeleteTimetableRequest) => api.deleteTimetable(EventId).then((res) => {
        console.log("시간표 내 스케쥴 삭제 api", res);
        return res.data.result; //boolean 값
    })
    .catch((err) => console.error(err));

// [
//     {
//         "day": "MON / TUE / WED / THU / FRI / SAT / SUN",
//         "startTime": "11:00:00.000000",
//         "endTime": "11:00:00.000000",
//         "eventName": "분산시스템과컴퓨팅",
//         "eventDetail": "신공1201",
//         "color": "#f6f6f6"
//     }
// ] 

// export const sendDummyEventRequest = (event: Event) => {
//     const { addNewLoadTable } = useLoadTableStore.getState()
//     addNewLoadTable(event)
// }
