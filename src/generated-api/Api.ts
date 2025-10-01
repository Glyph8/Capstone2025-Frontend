/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateReviewRequest {
  /**
   * 관련된 비교과 id
   * @format int64
   * @example 1
   */
  extracurricularId?: number;
  /**
   * 리뷰내용
   * @example "도움이 많이 됩니다."
   */
  content?: string;
  /**
   * 별점
   * @example "ONE, TWO, THREE, FOUR, FIVE"
   */
  star: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
}

export interface ApiResponseBoolean {
  result?: boolean;
}

/**
 * 끝 시간
 * @example "11:00:00.000000"
 */
export interface LocalTime {
  /** @format int32 */
  hour?: number;
  /** @format int32 */
  minute?: number;
  /** @format int32 */
  second?: number;
  /** @format int32 */
  nano?: number;
}

export interface MakeMemberTimetableRequest {
  /**
   * 요일
   * @example "MON / TUE / WED / THU / FRI / SAT / SUN"
   */
  day?: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  /** 끝 시간 */
  startTime?: LocalTime;
  /** 끝 시간 */
  endTime?: LocalTime;
  /**
   * 이벤트 이름
   * @example "분산시스템과컴퓨팅"
   */
  eventName?: string;
  /**
   * 이벤트 상세
   * @example "신공1201"
   */
  eventDetail?: string;
  /**
   * color
   * @example "#f6f6f6"
   */
  color?: string;
}

export interface CreateScheduleRequest {
  /**
   * 스케줄 제목
   * @example "백엔드 비교과 신청"
   */
  title: string;
  /**
   * 스케쥴 상세정보
   * @example "공C487에서 열릴 예정, 시간은 17시 ~ 19시"
   */
  content: string;
  /**
   * 시작 일자(비교과 관련 일정이면 null로)
   * @format date-time
   */
  startDateTime?: string;
  /**
   * 끝 일자(비교과 관련 일정이면 null로)
   * @format date-time
   */
  endDateTime?: string;
  /**
   * 관련된 비교과 id
   * @format int64
   * @example 1
   */
  extracurricularId?: number;
}

export interface SetPasswordRequest {
  /**
   * 패스워드 설정
   * @example "password1234@#$"
   */
  password?: string;
}

export interface InterestRequest {
  /**
   * 관심사항
   * @example "웹 개발, AI, 백엔드"
   */
  interestContent: string;
}

export interface SendAuthMailRequest {
  /**
   * 인증할 이메일
   * @example "abc@konkuk.ac.kr"
   */
  email?: string;
}

export interface VerifyAuthCodeRequest {
  /**
   * 확인할 이메일
   * @example "abc@konkuk.ac.kr"
   */
  email?: string;
  /**
   * 인증코드
   * @example "123456"
   */
  code?: string;
}

export interface AcademicInfoRequest {
  /**
   * 재학상태
   * @example "ENROLLED / LEAVE_OF_ABSENCE / GRADUATED"
   */
  academicStatus: "ENROLLED" | "LEAVE_OF_ABSENCE" | "GRADUATED";
  /**
   * 학년
   * @format int64
   * @example 1
   */
  grade: number;
  /**
   * 단과대학
   * @example "공과대학"
   */
  college: string;
  /**
   * 학과
   * @example "컴퓨터공학부"
   */
  department: string;
  /**
   * 이름
   * @example "홍길동"
   */
  name: string;
}

export interface QuestionToChatServerRequest {
  question?: string;
}

export interface ApiResponseQuestionToChatServerResponse {
  result?: QuestionToChatServerResponse;
}

/** 챗봇이 추천한 비교과 프로그램 목록 */
export interface Program {
  /** @format int64 */
  id?: number;
  title?: string;
  url?: string;
}

export interface QuestionToChatServerResponse {
  /**
   * 응답
   * @example "OO님의 관심사는 ~~이며, 다음의 비교과를 추천합니다."
   */
  answer?: string;
  /** 챗봇이 추천한 비교과 프로그램 목록 */
  sources?: Program[];
}

export interface ChangeTimetableRequest {
  /**
   * 수정할 시간표 엔트리 ID값
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 요일
   * @example "MON / TUE / WED / THU / FRI / SAT / SUN"
   */
  day?: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  /** 끝 시간 */
  startTime?: LocalTime;
  /** 끝 시간 */
  endTime?: LocalTime;
  /**
   * 이벤트 이름
   * @example "분산시스템과컴퓨팅"
   */
  eventName?: string;
  /**
   * 이벤트 상세
   * @example "신공1201"
   */
  eventDetail?: string;
  /**
   * color
   * @example "#f6f6f6"
   */
  color?: string;
}

export interface ChangeScheduleRequest {
  /**
   * 수정할 스케쥴 id(pk값)
   * @format int64
   * @example 1
   */
  scheduleId: number;
  /**
   * 스케줄 제목
   * @example "백엔드 비교과 신청"
   */
  title: string;
  /**
   * 스케쥴 상세정보
   * @example "공C487에서 열릴 예정, 시간은 17시 ~ 19시"
   */
  content: string;
  /**
   * 시작 일자
   * @format date-time
   */
  startDateTime?: string;
  /**
   * 끝 일자
   * @format date-time
   */
  endDateTime?: string;
  /**
   * 수정할 비교과 id
   * @format int64
   */
  extracurricularId?: number;
}

export interface ApiResponsePageResponseReviewResponse {
  result?: PageResponseReviewResponse;
}

export interface PageResponseReviewResponse {
  /** 페이지 응답 */
  data?: ReviewResponse[];
  /**
   * 전체 페이지 수
   * @format int32
   */
  totalPages?: number;
  /** 마지막 페이지 여부 */
  isLastPage?: boolean;
}

/** 페이지 응답 */
export interface ReviewResponse {
  /**
   * 리뷰ID
   * @format int64
   * @example 1
   */
  reviewId?: number;
  /**
   * 관련된 비교과 ID
   * @format int64
   * @example 1
   */
  extracurricularId?: number;
  /**
   * 관련된 비교과 제목
   * @example "A비교과"
   */
  title?: string;
  /**
   * 리뷰내용
   * @example "좋아요!"
   */
  content?: string;
  /**
   * 별점
   * @example "FIVE"
   */
  star?: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
}

export interface ApiResponseListLookupTimetableResponse {
  result?: LookupTimetableResponse[];
}

export interface LookupTimetableResponse {
  /**
   * 시간표 엔트리 ID(DB PK값)
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 요일
   * @example "MON"
   */
  day?: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  /**
   * 색상
   * @example "#f6f6f6"
   */
  color?: string;
  /**
   * 시간표 제목
   * @example "운영체제"
   */
  eventName?: string;
  /**
   * 시간표 내용
   * @example "공C487"
   */
  eventDetail?: string;
  /** 끝 시간 */
  startTime?: LocalTime;
  /** 끝 시간 */
  endTime?: LocalTime;
}

export interface ApiResponsePageResponseExtracurricularResponse {
  result?: PageResponseExtracurricularResponse;
}

/** 페이지 응답 */
export interface ExtracurricularResponse {
  /**
   * 비교과 id
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 비교과 제목
   * @example "온라인 학습법 특강(AI)"
   */
  title?: string;
  /**
   * 비교과 url
   * @example "https://abc.cdf"
   */
  url?: string;
  /**
   * 비교과 등록 시작일
   * @format date-time
   */
  applicationStart?: string;
  /**
   * 비교과 등록 마감일
   * @format date-time
   */
  applicationEnd?: string;
  /**
   * 비교과 활동 시작일
   * @format date-time
   */
  activityStart?: string;
  /**
   * 비교과 활동 마감일
   * @format date-time
   */
  activityEnd?: string;
}

export interface PageResponseExtracurricularResponse {
  /** 페이지 응답 */
  data?: ExtracurricularResponse[];
  /**
   * 전체 페이지 수
   * @format int32
   */
  totalPages?: number;
  /** 마지막 페이지 여부 */
  isLastPage?: boolean;
}

export interface ApiResponseListGetScheduleByYearAndMonthResponse {
  result?: GetScheduleByYearAndMonthResponse[];
}

export interface GetScheduleByYearAndMonthResponse {
  /**
   * 스케쥴 id
   * @format int64
   * @example 1
   */
  scheduleId?: number;
  /**
   * 스케쥴 제목
   * @example "A비교과"
   */
  title?: string;
  /**
   * 스케쥴 타입
   * @example "EXTRACURRICULAR(비교과 관련), NORMAL(일반 일정)"
   */
  scheduleType?: "EXTRACURRICULAR" | "NORMAL";
  /**
   * 시작 날짜
   * @format date-time
   */
  startDateTime?: string;
  /**
   * 끝 날짜
   * @format date-time
   */
  endDateTime?: string;
}

export interface ApiResponseGetScheduleDetailResponse {
  result?: GetScheduleDetailResponse;
}

/** 관련된 비교과(일반 일정일 경우에는 null값이 들어옴) */
export interface ExtracurricularField {
  /**
   * 비교과 이름
   * @example "A비교과"
   */
  originTitle?: string;
  /**
   * 비교과 url
   * @example "https://abc.com"
   */
  url?: string;
  /**
   * 신청시작 일자
   * @format date-time
   */
  applicationStart?: string;
  /**
   * 신청종료 일자
   * @format date-time
   */
  applicationEnd?: string;
  /**
   * 활동시작 일자
   * @format date-time
   */
  activityStart?: string;
  /**
   * 활동종료 일자
   * @format date-time
   */
  activityEnd?: string;
}

export interface GetScheduleDetailResponse {
  /**
   * 스케쥴 제목
   * @example "A비교과"
   */
  title?: string;
  /**
   * 스케쥴 상세정보
   * @example "공C487에서 열릴 예정, 시간은 17시 ~ 19시"
   */
  content?: string;
  /**
   * 스케쥴 타입
   * @example "EXTRACURRICULAR(비교과 관련), NORMAL(일반 일정)"
   */
  scheduleType?: "EXTRACURRICULAR" | "NORMAL";
  /**
   * 시작 날짜
   * @format date-time
   */
  startDateTime?: string;
  /**
   * 끝 날짜
   * @format date-time
   */
  endDateTime?: string;
  /** 관련된 비교과(일반 일정일 경우에는 null값이 들어옴) */
  extracurricularField?: ExtracurricularField;
}

export interface ApiResponseLookupInterestResponse {
  result?: LookupInterestResponse;
}

export interface LookupInterestResponse {
  /**
   * 관심 사항 정보
   * @example ["AI","프로그래밍"]
   */
  interests?: string[];
}

export interface ApiResponseLookupMemberInfoResponse {
  result?: LookupMemberInfoResponse;
}

export interface LookupMemberInfoResponse {
  /**
   * member PK 값(유저 ID)
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 이름
   * @example "김철수"
   */
  name?: string;
  /**
   * email 정보
   * @example "abc@def.com"
   */
  email?: string;
  /**
   * 학적 정보
   * @example "ENROLLED / LEAVE_OF_ABSENCE / GRADUATED"
   */
  academicStatus?: "ENROLLED" | "LEAVE_OF_ABSENCE" | "GRADUATED";
  /**
   * 대학 정보
   * @example "공과대학"
   */
  college?: string;
  /**
   * 학과 정보
   * @example "컴퓨터공학부"
   */
  department?: string;
  /**
   * 학년 정보
   * @format int64
   * @example 1
   */
  grade?: number;
}

export interface DeleteTimetableRequest {
  /**
   * 삭제할 시간표 Id
   * @format int64
   * @example 1
   */
  deleteTimetableId: number;
}

export interface DeleteScheduleRequest {
  /**
   * 삭제할 스케쥴 Id
   * @format int64
   * @example 1
   */
  deleteScheduleId: number;
}

export interface DeleteMyReviewRequest {
  /**
   * 삭제할 리뷰 Id
   * @format int64
   * @example 1
   */
  deleteReviewId?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://capstone-backend.o-r.kr",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Capstone Design API Docs
 * @baseUrl https://capstone-backend.o-r.kr
 *
 * 졸업프로젝트 관련 spring 서버 Api Document 입니다.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags health-check-controller
   * @name HealthCheck
   * @request GET:/
   * @secure
   */
  healthCheck = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: "GET",
      secure: true,
      ...params,
    });

  v1 = {
    /**
     * @description viewReview
     *
     * @tags 리뷰
     * @name ViewReview
     * @summary 리뷰조회
     * @request GET:/v1/review
     * @secure
     */
    viewReview: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseReviewResponse, any>({
        path: `/v1/review`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description createReview
     *
     * @tags 리뷰
     * @name CreateReview
     * @summary 리뷰쓰기
     * @request POST:/v1/review
     * @secure
     */
    createReview: (data: CreateReviewRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/review`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description lookUptimeTable
     *
     * @tags 멤버 정보 조회
     * @name LookupTimetable
     * @summary 내 시간표 조회
     * @request GET:/v1/member/timetable
     * @secure
     */
    lookupTimetable: (params: RequestParams = {}) =>
      this.request<ApiResponseListLookupTimetableResponse, any>({
        path: `/v1/member/timetable`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description makeMemberTimetable
     *
     * @tags 내 정보 설정 컨트롤러
     * @name MakeTimetable
     * @summary 시간표 만들기
     * @request POST:/v1/member/timetable
     * @secure
     */
    makeTimetable: (
      data: MakeMemberTimetableRequest[],
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/timetable`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description deleteTimetable
     *
     * @tags 내 정보 설정 컨트롤러
     * @name DeleteTimetable
     * @summary 시간표 삭제
     * @request DELETE:/v1/member/timetable
     * @secure
     */
    deleteTimetable: (
      data: DeleteTimetableRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/timetable`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description changeTimetable
     *
     * @tags 내 정보 설정 컨트롤러
     * @name ChangeTimetable
     * @summary 시간표 변경
     * @request PATCH:/v1/member/timetable
     * @secure
     */
    changeTimetable: (
      data: ChangeTimetableRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/timetable`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description createSchedule
     *
     * @tags 스케쥴(캘린더)
     * @name CreateSchedule
     * @summary 스케쥴 생성
     * @request POST:/v1/member/schedule
     * @secure
     */
    createSchedule: (data: CreateScheduleRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/schedule`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description deleteSchedule
     *
     * @tags 스케쥴(캘린더)
     * @name DeleteSchedule
     * @summary 스케쥴 삭제
     * @request DELETE:/v1/member/schedule
     * @secure
     */
    deleteSchedule: (data: DeleteScheduleRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/schedule`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description changeSchedule
     *
     * @tags 스케쥴(캘린더)
     * @name ChangeSchedule
     * @summary 스케쥴 수정
     * @request PATCH:/v1/member/schedule
     * @secure
     */
    changeSchedule: (data: ChangeScheduleRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/schedule`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description setPassword
     *
     * @tags 온보딩
     * @name SetPassword
     * @summary 패스워드 설정
     * @request POST:/v1/member/password
     * @secure
     */
    setPassword: (data: SetPasswordRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description lookupInterest
     *
     * @tags 멤버 정보 조회
     * @name LookupInterest
     * @summary 관심사항 조회
     * @request GET:/v1/member/interest
     * @secure
     */
    lookupInterest: (params: RequestParams = {}) =>
      this.request<ApiResponseLookupInterestResponse, any>({
        path: `/v1/member/interest`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description createInterestInfo
     *
     * @tags 내 정보 설정 컨트롤러
     * @name CreateInterestInfo
     * @summary 관심사항 입력받기
     * @request POST:/v1/member/interest
     * @secure
     */
    createInterestInfo: (data: InterestRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/interest`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description changeInterest
     *
     * @tags 내 정보 설정 컨트롤러
     * @name ChangeInterest
     * @summary 관심사항 변경
     * @request PATCH:/v1/member/interest
     * @secure
     */
    changeInterest: (data: InterestRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/interest`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description sendAuthMail
     *
     * @tags 온보딩
     * @name SendAuthMail
     * @summary 메일 인증 번호 보내기
     * @request POST:/v1/member/auth-mail
     * @secure
     */
    sendAuthMail: (data: SendAuthMailRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/auth-mail`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description sendAuthMail
     *
     * @tags 온보딩
     * @name VerifyAuthCode
     * @summary 메일 인증 번호 확인
     * @request POST:/v1/member/auth-code
     * @secure
     */
    verifyAuthCode: (data: VerifyAuthCodeRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/auth-code`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description upsertAcademicInfo
     *
     * @tags 내 정보 설정 컨트롤러
     * @name UpsertAcademicInfo
     * @summary 학적정보 입력 받기(수정용으로 써도 무관)
     * @request POST:/v1/member/academic-info
     * @secure
     */
    upsertAcademicInfo: (
      data: AcademicInfoRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/academic-info`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description questionToChatServer
     *
     * @tags 챗봇 관련 API
     * @name QuestionToChatServer
     * @summary 챗봇에 질문
     * @request POST:/v1/chat
     * @secure
     */
    questionToChatServer: (
      data: QuestionToChatServerRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseQuestionToChatServerResponse, any>({
        path: `/v1/chat`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description registerMemberInfo
     *
     * @tags 챗봇 관련 API
     * @name RegisterMemberInfo
     * @summary 챗봇에 사용자 정보 등록
     * @request POST:/v1/chat/registration
     * @secure
     */
    registerMemberInfo: (params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/chat/registration`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description searchReview
     *
     * @tags 리뷰
     * @name SearchReview
     * @summary 리뷰검색
     * @request GET:/v1/search-review
     * @secure
     */
    searchReview: (
      query: {
        key: string;
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseReviewResponse, any>({
        path: `/v1/search-review`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description searchMyReview
     *
     * @tags 리뷰
     * @name SearchMyReview
     * @summary 내 리뷰 검색
     * @request GET:/v1/member/search-review
     * @secure
     */
    searchMyReview: (
      query: {
        key: string;
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseReviewResponse, any>({
        path: `/v1/member/search-review`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description searchMyExtracurricular
     *
     * @tags 내가 추가한 비교과 활동 관련 컨트롤러
     * @name SearchMyExtracurricular
     * @summary 내가 추가한 비교과 활동 검색
     * @request GET:/v1/member/search-extracurricular
     * @secure
     */
    searchMyExtracurricular: (
      query: {
        key: string;
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseExtracurricularResponse, any>({
        path: `/v1/member/search-extracurricular`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description getmonthlySchedule
     *
     * @tags 스케쥴(캘린더)
     * @name GetScheduleByYearAndMonth
     * @summary 년월별 스케쥴 조회
     * @request GET:/v1/member/schedule/{year}/{month}
     * @secure
     */
    getScheduleByYearAndMonth: (
      year: number,
      month: number,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseListGetScheduleByYearAndMonthResponse, any>({
        path: `/v1/member/schedule/${year}/${month}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description getScheduleDetail
     *
     * @tags 스케쥴(캘린더)
     * @name GetScheduleDetail
     * @summary 스케쥴 상세 조회
     * @request GET:/v1/member/schedule/{scheduleId}
     * @secure
     */
    getScheduleDetail: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ApiResponseGetScheduleDetailResponse, any>({
        path: `/v1/member/schedule/${scheduleId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description viewMyReview
     *
     * @tags 리뷰
     * @name ViewMyReview
     * @summary 내 리뷰 조회
     * @request GET:/v1/member/review
     * @secure
     */
    viewMyReview: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseReviewResponse, any>({
        path: `/v1/member/review`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description deleteMyReview
     *
     * @tags 리뷰
     * @name DeleteMyReview
     * @summary 내 리뷰 삭제
     * @request DELETE:/v1/member/review
     * @secure
     */
    deleteMyReview: (data: DeleteMyReviewRequest, params: RequestParams = {}) =>
      this.request<ApiResponseBoolean, any>({
        path: `/v1/member/review`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description lookupMemberInfo
     *
     * @tags 멤버 정보 조회
     * @name LookupMemberInfo
     * @summary 멤버 정보 조회
     * @request GET:/v1/member/information
     * @secure
     */
    lookupMemberInfo: (params: RequestParams = {}) =>
      this.request<ApiResponseLookupMemberInfoResponse, any>({
        path: `/v1/member/information`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description lookupMyExtracurricular
     *
     * @tags 내가 추가한 비교과 활동 관련 컨트롤러
     * @name LookupMyExtracurricular
     * @summary 내가 추가한 비교과 활동 조회
     * @request GET:/v1/member/extracurricular
     * @secure
     */
    lookupMyExtracurricular: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseExtracurricularResponse, any>({
        path: `/v1/member/extracurricular`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description searchExtracurricular
     *
     * @tags 비교과 관련
     * @name SearchExtracurricular
     * @summary 비교과 검색
     * @request GET:/v1/extracurricular
     * @secure
     */
    searchExtracurricular: (
      query: {
        key: string;
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponsePageResponseExtracurricularResponse, any>({
        path: `/v1/extracurricular`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
