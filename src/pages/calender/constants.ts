
import type { GetScheduleByYearAndMonthResponse, GetScheduleDetailResponse } from "@/api/Api";

/** /v1/member/schedule/{year}/{month} 응답 -> result만 빼옴*/
export const dummyCalender: GetScheduleByYearAndMonthResponse[] =
    [
        {
            "scheduleId": 1,
            "title": "A비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDateTime": "2025-08-01",
            "endDateTime": "2025-08-01"
        },
        {
            "scheduleId": 2,
            "title": "A일반",
            "scheduleType": "NORMAL",
            "startDateTime": "2025-08-01",
            "endDateTime": "2025-08-12"
        },
        {
            "scheduleId": 3,
            "title": "B비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDateTime": "2025-08-19",
            "endDateTime": "2025-08-20"
        },
        {
            "scheduleId": 4,
            "title": "C비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDateTime": "2025-08-12",
            "endDateTime": "2025-08-12"
        },
        {
            "scheduleId": 5,
            "title": "B일반",
            "scheduleType": "NORMAL",
            "startDateTime": "2025-08-29",
            "endDateTime": "2025-08-29"
        },
        {
            "scheduleId": 6,
            "title": "D일반",
            "scheduleType": "NORMAL",
            "startDateTime": "2025-08-29",
            "endDateTime": "2025-08-29"
        }
    ]

export const dummySchedule:GetScheduleDetailResponse = {
    title: "테스트1",
    scheduleType: "EXTRACURRICULAR",
    content: "더미 컨텐츠 설명",
    startDateTime: "2025-08-19",
    endDateTime: "2025-08-19",
}