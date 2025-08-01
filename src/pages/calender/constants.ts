// {
//   "result": [
//     {
//       "scheduleId": 1,
//       "title": "A비교과",
//       "scheduleType": "EXTRACURRICULAR(비교과 관련), NORMAL(일반 일정)",
//       "startDate": "2025-07-19",
//       "endDate": "2025-07-20"
//     }
//   ]
// }

/** /v1/member/schedule/{year}/{month} 응답 -> result만 빼옴*/
export const dummyCalender =
    [
        {
            "scheduleId": 1,
            "title": "A비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDate": "2025-08-01",
            "endDate": "2025-08-01"
        },
        {
            "scheduleId": 2,
            "title": "A일반",
            "scheduleType": "NORMAL",
            "startDate": "2025-08-01",
            "endDate": "2025-08-12"
        },
        {
            "scheduleId": 3,
            "title": "B비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDate": "2025-08-19",
            "endDate": "2025-08-20"
        },
        {
            "scheduleId": 4,
            "title": "C비교과",
            "scheduleType": "EXTRACURRICULAR",
            "startDate": "2025-08-12",
            "endDate": "2025-08-12"
        },
        {
            "scheduleId": 5,
            "title": "B일반",
            "scheduleType": "NORMAL",
            "startDate": "2025-08-29",
            "endDate": "2025-08-29"
        },
        {
            "scheduleId": 6,
            "title": "D일반",
            "scheduleType": "NORMAL",
            "startDate": "2025-08-29",
            "endDate": "2025-08-29"
        }
    ]
