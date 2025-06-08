import axios from "axios"
const CHATBOT_API_URL = "/v1/chat/"

export const sendQuestionDummy = (question: string) => {
    console.log(question)
    const result = {
        answer: "김철수님의 관심사는 창업, 마케팅, 경영입니다, 시간표는 다음과 같습니다:\n월 11:00~12:30\n수 09:00~10:30\n금 13:00~14:30\n위 정보를 바탕으로 시간표와 겹치지 않고 창업, 마케팅, 경영과 관련된 활동을 추천해드립니다.",
        recommendedProgramList : [
        {
          title: "제목1",
          url: "string",
          applicationPeriod: "string",
          targetAudience: "string",
          selectionMethod: "string",
          duration: "string",
          purposeOfTheActivity: "string",
          participationBenefitsAndExpectedOutcomes: "string",
          process: "string",
          modeOfOperation: "string"
        }
        ]
  }
  return result
}

export const sendQuestion = (question: string) => axios.post(CHATBOT_API_URL, {
        question : question,
    })
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            return error
        });



// {
//   "result": {
//     "answer": "OO님의 관심사는 ~~이며, 다음의 비교과를 추천합니다.",
//     "recommendedProgramList": [
//       {
//         "title": "string",
//         "url": "string",
//         "applicationPeriod": "string",
//         "targetAudience": "string",
//         "selectionMethod": "string",
//         "duration": "string",
//         "purposeOfTheActivity": "string",
//         "participationBenefitsAndExpectedOutcomes": "string",
//         "process": "string",
//         "modeOfOperation": "string"
//       }
//     ]
//   }
// }