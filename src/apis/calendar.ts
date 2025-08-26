import type { CreateScheduleRequest } from "@/api/Api";
import api from "@/apis/index"


export const getCalendarApi = async (year:number, month:number) => {
    try {
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
        const response = api.getScheduleDetail(scheduleId);
        return (await response).data.result;
    }
    catch(error){
        console.error("스케줄 상세 조회 api 요청 실패 : error ", error);
        throw new Error("스케줄 상세 조회 진행 중 오류 발생"); 
    }
    
} 

export const createScheduleApi = async (newEvent: CreateScheduleRequest) => {
    try {
        const response = api.createSchedule(newEvent)
        return (await response).data.result;
    }
    catch(error){
        console.error("스케쥴 생성 api 요청 실패 : error ", error);
        throw new Error("스케쥴 생성 진행 중 오류 발생"); 
    }
} 

export const deleteDetailScheduleApi = async (deleteScheduleId:number) => {

    try {
        const response = api.deleteSchedule({ deleteScheduleId });
        return (await response).data.result;
    }
    catch(error){
        console.error("스케줄 삭제 api 요청 실패 : error ", error);
        throw new Error("스케줄 삭제 진행 중 오류 발생"); 
    }
    
} 