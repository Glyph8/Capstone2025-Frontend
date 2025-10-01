
// 1. Api 클래스의 인스턴스를 먼저 생성합니다.

import { Api } from "@/generated-api/Api";

const baseApi = new Api({
    baseURL: 'https://capstone-backend.o-r.kr',
    securityWorker: () => {
        const token = localStorage.getItem("access_token");
        
        return {
            headers: {
                Authorization: token,
            },
        };
    },
    secure: true, // security가 필요한 엔드포인트에 자동 적용
});

baseApi.instance.interceptors.response.use(
    // 1. 성공적인 응답을 그대로 반환합니다.
    (response) => response,

    // 2. 에러가 발생했을 때 처리합니다.
    (error) => {
        // error.response가 존재하고, status 코드가 401일 때
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error("인증 에러! 로그인이 필요합니다.");

            // 기존 토큰을 삭제합니다.
            localStorage.removeItem("access_token");
            // 로그인 페이지로 이동시킵니다.
            window.location.href = "/auth/login";
        }
        
        // 처리한 에러를 다시 throw하여, API를 호출한 쪽에서도 에러를 인지할 수 있게 합니다.
        return Promise.reject(error);
    }
);

// 인터셉터가 적용된 이 'api' 객체를 프로젝트 전역에서 사용하도록 + 주로 사용하는 v1을 export
const api = baseApi.v1;
export default api;