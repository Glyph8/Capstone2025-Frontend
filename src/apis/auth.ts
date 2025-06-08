import axios from "axios"
import type { AcademicInfo} from "../types/types"
const AUTH_MAIL_API_URL = "/v1/member/auth-mail"
const AUTH_CODE_API_URL = "/v1/member/auth-code"
const PW_API_URL = "/v1/member/password"

// 메일 인증 번호 보내기 POST - result true 받음
export const sendMailRequest = (mailAddress: string) => axios.post(AUTH_MAIL_API_URL, {
    email: `${mailAddress}@konkuk.ac.kr`
})
    .then(Response => {
        console.log(Response.data)
        return Response.data
        }
    )
    .catch(error => {
        console.error(error)
        return "메일로 코드 요청 오류"
    }
    );


// 메일 인증 번호 확인하기 POST - 비밀번호 설정용 토큰 응답받음.
export const verifyAuthCode = (mailAddress: string, code: string) => axios.post(AUTH_CODE_API_URL, {
    email: `${mailAddress}@konkuk.ac.kr`,
    code: code
})
    .then(Response => {
        console.log(Response.data)
        return Response.data
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
    // headers: {Authorization: token,}
})
    .then(Response => {
        console.log(Response.data)
        return Response.data
        }
    )
    .catch(error => {
        console.error(error)
        return "서비스 토큰 요청 오류"
    }
    );

// 관심사항 입력하기 POST - result true 받음
export const enrollInterest = (interests: string[]) => axios.post(PW_API_URL, {
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
export const enrollAcademicInfo = (academicInfo: AcademicInfo) => axios.post(PW_API_URL, {
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

// "academicStatus": "ENROLLED / LEAVE_OF_ABSENCE / GRADUATED",
//     "grade": 1,
//         "college": "공과대학",
//             "department": "컴퓨터공학부",
//                 "name": "홍길동"
