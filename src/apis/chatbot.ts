import api from "@/apis/index"

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
