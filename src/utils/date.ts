/**
 * Date 객체에서 시간, 분, 초, 밀리초를 제거하고
 * '날짜' 정보만 가진 새로운 Date 객체를 반환합니다.
 * @param date - 원본 Date 객체
 * @returns 시간이 00:00:00으로 설정된 Date 객체
 */
export const getDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * ISO 8601 형식의 문자열(혹은 Date 객체)을 
 * "YYYY년 MM월 DD일 HH시:mm분" 형식의
 * 한국어 문자열로 변환합니다.
 * @param dateInput - ISO 8601 형식의 날짜/시간 문자열 또는 Date 객체
 * @returns 포맷팅된 한국어 날짜/시간 문자열
 */
export const formatKoreanDateTimeNative = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) {
    return "날짜 정보 없음"; // null, undefined, 빈 문자열 처리
  }

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "유효하지 않은 날짜"; // 'Invalid Date' 처리
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시:${minutes}분`;
};