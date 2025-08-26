import axios from "axios"

import api from "@/apis/index"
import type { AcademicInfo } from "@/types/auth-types";

const LOGIN_API_URL = "https://capstone-backend.o-r.kr/login";
const AUTH_MAIL_API_URL = "https://capstone-backend.o-r.kr/v1/member/auth-mail"
const AUTH_CODE_API_URL = "https://capstone-backend.o-r.kr/v1/member/auth-code"
const PW_API_URL = "https://capstone-backend.o-r.kr/v1/member/password"

export const loginRequest = (email: string, pw: string) => axios.post(LOGIN_API_URL, {
    email: email,
    pw: pw,
}).then(response => {
    console.log(response);
    console.log(response.headers);
    console.log(response.data);
    localStorage.setItem("access_token", response.headers['access_token']);
    return response.data
})


// 메일 인증 번호 보내기 POST - result true 받음
export const sendMailRequest = (mailAddress: string) => axios.post(AUTH_MAIL_API_URL, {
    // email: "abc@konkuk.ac.kr"
    email: `${mailAddress}`
})
    .then(response => {
        console.log("테스트용 메일 인증 확인 중. 실제 입력 값 : ", mailAddress)
        console.log(response)
        console.log(response.headers)
        console.log(response.data, response.data.result)
        return response.data.result
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
    .then(response => {
        const token = response.headers['access_token']
        if (!token) {
            throw new Error("Token not found in headers");
        }
        console.log("메일 인증 번호 확인 중. 입력 값 : ", mailAddress, code)
        console.log(response)
        console.log(response.headers)
        console.log(response.data)
        localStorage.setItem("password-token", token);
        return response.data.result
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
    password: password
}, {
    headers: {
        Authorization: localStorage.getItem("password-token"),
    }
})
    .then(response => {
        console.log("메인 서비스 토큰 요청 성공");
        console.log("응답 데이터 : ", response.data)
        console.log("header : ", response.headers)
        const token = response.headers['access_token'];
        if (!token) {
            throw new Error("Token not found in headers");
        }
        localStorage.setItem("access-token", token);
        return response.data;
    }
    )
    .catch(error => {
        console.error(error)
        return "서비스 토큰 요청 오류"
    }
    );

// 관심사항 입력하기 POST - result true 받음
export const enrollInterest = (interests: string[]) => api.createInterestInfo({
    interestContent: interests.join(",")
})
    .then(response => {
        console.log(response.data)
        return response.data
    }
    )
    .catch(error => {
        console.log("전송한 값 : ", interests)
        console.error(error)
        return false
    }
    );

// 학적 정보 + 챗봇이 부를 이름 입력받기 POST - result true 받음
export const enrollAcademicInfo = (academicInfo: AcademicInfo) => api.upsertAcademicInfo({
    academicStatus: academicInfo.academicStatus,
    grade: academicInfo.grade,
    college: academicInfo.college,
    department: academicInfo.department,
    name: academicInfo.name,
})
    .then(response => {
        console.log(response.data)
        return response.data
    }
    )
    .catch(error => {
        console.error(error)
        return false
    }
    );
