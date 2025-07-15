import axios from "axios"
import type { AcademicInfo } from "../types/types"
const LOGIN_API_URL = "https://capstone-backend.o-r.kr/login";
const AUTH_MAIL_API_URL = "https://capstone-backend.o-r.kr/v1/member/auth-mail"
const AUTH_CODE_API_URL = "https://capstone-backend.o-r.kr/v1/member/auth-code"

const PW_API_URL = "https://capstone-backend.o-r.kr/v1/member/password"
const INTEREST_API_URL = "/v1/member/password"
const STDINFO_API_URL = "/v1/member/password"

export const apiClient = axios.create({ baseURL: 'https://capstone-backend.o-r.kr' });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mainToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


export const loginRequest = (email: string, pw: string) => axios.post(LOGIN_API_URL, {
    email: email,
    pw: pw,
}).then(Response => {
    console.log(Response);
    console.log(Response.headers);
    console.log(Response.data);
    localStorage.setItem("mainToken", Response.headers['access_token']);
    return Response.data
})

// export const testLogin = (email: string, pw: string) => axios.post(LOGIN_API_URL, {
//     email: "abc@def.com",
//     pw: "password1234@#$"
// }).then(Response => {
//     console.log(email, pw, Response.data);
//     localStorage.setItem("mainToken", "eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2Vzc190b2tlbiIsImVtYWlsIjoicHJhb284MDBAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfVEVNUE9SQVJZX01FTUJFUiIsImlhdCI6MTc0ODE0NjU4OSwiZXhwIjoxNzQ4MTUwMTg5fQ.PTvTZ5Ctsb-FelHAVVfdSCiYTwoBtUpyLYlYUjMGHoQ");
//     return Response.data
// })

// 메일 인증 번호 보내기 POST - result true 받음
export const sendMailRequest = (mailAddress: string) => axios.post(AUTH_MAIL_API_URL, {
    // email: "abc@konkuk.ac.kr"
    email: `${mailAddress}`
})
    .then(Response => {
        console.log("테스트용 메일 인증 확인 중. 실제 입력 값 : ", mailAddress)
        console.log(Response)
        console.log(Response.headers)
        console.log(Response.data, Response.data.result)
        return Response.data.result
    }
    )
    .catch(error => {
        console.error("메일 요청에서 에러 발생", error)
        return "메일로 코드 요청 오류"
    }
    );


// 메일 인증 번호 확인하기 POST - 비밀번호 설정용 토큰 응답받음.
export const verifyAuthCode = (mailAddress: string, code: string) => axios.post(AUTH_CODE_API_URL, {
    email: `${mailAddress}`,
    code: code
})
    .then(Response => {
        const token = Response.headers['access_token']
        console.log("메일 인증 번호 확인 중. 입력 값 : ", mailAddress, code)
        console.log(Response)
        console.log(Response.headers)
        console.log(Response.data)
        localStorage.setItem("passwordToken", token);
        return Response.data.result
    }
    )
    .catch(error => {
        console.error(error)
        // "pw 토큰 요청 오류"
        return false
    }
    );


// 비밀번호 설정하기 POST - 메인 서비스 이용 토큰 응답받음.
export const enrollPW = (password: string) => axios.post(PW_API_URL, {
    // password: "password1234@#$"
    password: password
}, {
    headers: {
        Authorization: localStorage.getItem("passwordToken"),
        // Authorization: `bearer ${localStorage.getItem("passwordToken")}`,
    }
})
    .then(Response => {
        console.log("메인 서비스 토큰 요청 성공");
        console.log("응답 데이터 : ", Response.data)
        console.log("header : ", Response.headers)
        localStorage.setItem("mainToken", Response.headers['access']);
        return Response.data;
    }
    )
    .catch(error => {
        console.error(error)
        return "서비스 토큰 요청 오류"
    }
    );

// 관심사항 입력하기 POST - result true 받음
export const enrollInterest = (interests: string[]) => apiClient.post(INTEREST_API_URL, {
    interestContent: interests
})
    .then(Response => {
        console.log(Response.data)
        return Response.data
    }
    )
    .catch(error => {
        console.error(error)
        return false
    }
    );

// 학적 정보 + 챗봇이 부를 이름 입력받기 POST - result true 받음
export const enrollAcademicInfo = (academicInfo: AcademicInfo) => apiClient.post(STDINFO_API_URL, {
    academicStatus: academicInfo.academicStatus,
    grade: academicInfo.grade,
    college: academicInfo.college,
    department: academicInfo.department,
    name: academicInfo.name,
})
    .then(Response => {
        console.log(Response.data)
        return Response.data
    }
    )
    .catch(error => {
        console.error(error)
        return false
    }
    );
