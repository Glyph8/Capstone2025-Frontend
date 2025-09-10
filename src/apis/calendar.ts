import api from "@/apis/index"
import type { CreateScheduleRequest } from "@/generated-api/Api";

export const getCalendarApi = async (year:number, month:number) => {
    try {
        console.log(year, "년, " ,month , "월 캘린더 요청");
        const response = api.getScheduleByYearAndMonth(year, month);
        return (await response).data.result;
    }
    catch(error){
        console.error("캘린더 api 요청 실패 : error ", error);
        throw new Error("캘린더 로드 진행 중 오류 발생"); 
    }
} 

export const getDetailScheduleApi = async (scheduleId:number) => {

    try {
        const response = await api.getScheduleDetail(scheduleId);
        return response.data.result;
    }
    catch(error){
        console.error("스케줄 상세 조회 api 요청 실패 : error ", error);
        throw new Error("스케줄 상세 조회 진행 중 오류 발생"); 
    }
    
} 

export const createScheduleApi = async (newEvent: CreateScheduleRequest) => {
    try {
        const response = await api.createSchedule(newEvent)
        return response.data.result;
    }
    catch(error){
        console.error("스케쥴 생성 api 요청 실패 : error ", error);
        throw new Error("스케쥴 생성 진행 중 오류 발생"); 
    }
} 

// { deleteID } 처럼 객체 형태 파라미터를 받는 지 확인 후 수정
export const deleteDetailScheduleApi = async (deleteScheduleId:number) => {

    try {
        const response = await api.deleteSchedule({ deleteScheduleId });
        return response.data.result;
    }
    catch(error){
        console.error("스케줄 삭제 api 요청 실패 : error ", error);
        throw new Error("스케줄 삭제 진행 중 오류 발생"); 
    }
    
} 