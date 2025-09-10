import api from "@/apis/index"

export const sendQuestionDummy = (question: string) => {
    console.log(question)
    const result = {
        answer: "김철수님의 관심사는 창업, 마케팅, 경영입니다, 시간표는 다음과 같습니다:\n월 11:00~12:30\n수 09:00~10:30\n금 13:00~14:30\n위 정보를 바탕으로 시간표와 겹치지 않고 창업, 마케팅, 경영과 관련된 활동을 추천해드립니다.",
        recommendedProgramList : [
        {
          title: "제목:[혁신사업] 2025학년도 내:일 탐색 워크숍 5월-2차 (5/29 목): AI 시대 준비 전략: ChatGPT와 데이터 사이언스 (1학년 대상)",
          url: "URL:\nhttps://wein.konkuk.ac.kr/ptfol/imng/comprSbjtMngt/icmpNsbjtApl/genl/findTotPcondInfo.do?encSinbSeq=41dbcfc0d53d7838ef277e760912aa2a&intlNsbjtSxnCd=",
          applicationPeriod: "신청기간: 2025.05.02~2025.05.19",
          targetAudience: "대상자: 1학년",
          selectionMethod: "선정방법 : 선발",
          duration: "진행기간: 2025.05.29 15:00~2025.05.29 17:00",
          purposeOfTheActivity: "활동목적: 학업 성취 능력 향상 및 학습의 질 향상 도모",
          participationBenefitsAndExpectedOutcomes: "참여혜택 및 기대효과: 1. 비교과 수료증 2. KUM마일리지 20점 (만족도 조사 및 개선의견 설문조사를 완료해야 KUM마일리지 적립이 완료됩니다. 재학생 대상 비교과 프로그램이므로, 휴학생의 경우 참여 및 수료는 가능하나 마일리지 적립이 별도로 되지 않습니다)",
          process: "진행절차: 위인전 신청→선정자 개별 문자 발송(5/21(수))→참여→수료 예정자 만족도설문→최종 수료 및 KUM마일리지 적립",
          modeOfOperation: "운영방식: 대면(경영관 101호)"
        }
        ]
  }
  return result
}


export const sendUserQuestion = async (question: string) => {
    try {
        const response = await api.questionToChatServer({ question })
        return response.data.result;
    }
    catch(error){
        console.error("챗봇 api 요청 실패 : error ", error);
        throw new Error("챗봇 대화 전송 진행 중 오류 발생"); 
    }
}

/** 아직 완성안된듯? */
export const registerUserToChatbot = async () => {
    try {
        const response = await api.registerMemberInfo()
        console.log("챗봇에 사용자 등록 진행", response)
        return response.data.result;
    }
    catch(error){
        console.error("챗봇에 사용자 등록 실패 : error ", error);
        throw new Error("챗봇에 사용자 등록 진행 중 오류 발생"); 
    }
}


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