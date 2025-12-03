import api from ".";

/** 비교과 조회. 디폴트 */
export const searchExtracurricular = (key:string) =>
  api
    .searchExtracurricular({key})
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

// 예시 응답
// {
//   "result": {
//     "data": [
//       {
//         "id": 1,
//         "title": "온라인 학습법 특강(AI)",
//         "url": "https://abc.cdf",
//         "applicationStart": "2025-12-03T17:20:39.793Z",
//         "applicationEnd": "2025-12-03T17:20:39.793Z",
//         "activityStart": "2025-12-03T17:20:39.793Z",
//         "activityEnd": "2025-12-03T17:20:39.793Z"
//       }
//     ],
//     "totalPages": 0,
//     "isLastPage": true
//   }
// }