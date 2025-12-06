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
    secure: true,
});

baseApi.instance.interceptors.response.use(
    (response) => response,

    (error) => {
        // 유효한 로그인 상태가 아닐 때
        // if (error.response?.status === 401 || error.response?.status === 403) {
        //     console.error("인증 에러! 로그인이 필요합니다.");
        //     localStorage.removeItem("access_token");
        //     window.location.href = "/auth/login";
        // }
        
        return Promise.reject(error);
    }
);

const api = baseApi.v1;
export default api;