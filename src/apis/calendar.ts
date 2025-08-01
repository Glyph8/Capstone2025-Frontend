import { apiClient } from "./auth";

const CALENDAR_API_URL = '/v1/member/schedule';

export const getCalendarApi = async (year:number, month:number) => {

    try {
        const response = apiClient.get(`${CALENDAR_API_URL}/${year}/${month}`);
        return (await response).data.result;
    }
    catch(error){
        console.error("캘린더 api 요청 실패 : error ", error);
        throw new Error("캘린더 로드 진행 중 오류 발생"); 
    }
    
} 