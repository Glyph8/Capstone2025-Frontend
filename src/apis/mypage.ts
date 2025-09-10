import api from "@/apis/index"

// 사용자 정보 받기
export const getMyInfo = () => api.lookupMemberInfo()
    .then(response => {
        console.log(response.data)
        return response.data.result
    }
    )
    .catch(error => {
        console.log("멤버 정보 조회 api 에러 발생")
        console.error(error)
        throw new Error(error);
    }
    );

export const getMyHistoryList = async () => {
    try {
        const response = await api.lookupMyExtracurricular();
        console.log("내가 추가한 비교과 활동 조회", response)
        return response.data.result;
    }
    catch(error){
        console.error("내가 추가한 비교과 활동 조회 실패 : error ", error);
        throw new Error("내가 추가한 비교과 활동 조회 진행 중 오류 발생"); 
    }
}

export const searchMyHistoryList = async (key:string) => {
    try {
        const response = await api.searchMyExtracurricular({key});
        console.log("내가 추가한 비교과 활동 검색", response)
        return response.data.result;
    }
    catch(error){
        console.error("내가 추가한 비교과 활동 검색 실패 : error ", error);
        throw new Error("내가 추가한 비교과 활동 검색 중 오류 발생"); 
    }
}

