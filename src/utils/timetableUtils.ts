import type {
  LocalTime,
  MakeMemberTimetableRequest,
} from "@/generated-api/Api";

export const completeLocalTime = (time?: LocalTime): Required<LocalTime> => {
  if (time) {
    return {
      hour: time.hour ?? 0,
      minute: time.minute ?? 0,
      second: time.second ?? 0,
      nano: time.nano ?? 0,
    };
  }
  console.log("time이 undefined하여 0으로 초기화");
  return {
    hour: 0,
    minute: 0,
    second: 0,
    nano: 0,
  };
};


/**
 * "HH:MM:SS.NNNNNN" 형식의 문자열을 LocalTime 객체로 변환합니다.
 * 유효하지 않은 형식일 경우 undefined를 반환합니다.
 * @param timeString - 변환할 시간 문자열
 * @returns LocalTime 객체 또는 undefined
 */
export const parseFormattedTimeToLocalTime = (
  timeString: string | undefined | null
): LocalTime | undefined => {
  // 1. 입력값이 유효한지 먼저 확인합니다. (방어적 코딩)
  if (!timeString) {
    return undefined;
  }

  try {
    // 2. '.'을 기준으로 시간 부분과 나노초 부분으로 나눕니다.
    const [mainPart, microsecondPart] = timeString.split('.');
    
    // 3. ':'을 기준으로 시, 분, 초로 나눕니다.
    const [hourStr, minuteStr, secondStr] = mainPart.split(':');

    // 4. 각 문자열 부분을 10진수 숫자로 변환합니다.
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = parseInt(secondStr, 10);
    
    // 5. 마이크로초(백만분의 1초) 부분을 나노초(10억분의 1초)로 변환합니다. (* 1000)
    const nano = parseInt(microsecondPart, 10) * 1000;

    // 6. 모든 변환이 성공했는지 확인합니다. (e.g., "invalid-time" 같은 문자열이 들어올 경우)
    if (isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(nano)) {
      console.error("Invalid time string format:", timeString);
      return undefined;
    }

    return { hour, minute, second, nano };

  } catch (error) {
    // split 과정에서 에러가 날 경우 (e.g., "11:30" 처럼 형식이 맞지 않을 때)
    console.error("Failed to parse time string:", timeString, error);
    return undefined;
  }
};

export const formatLocalTime = (time: LocalTime | undefined): string => {
  // 1. 먼저 객체의 모든 값을 채워줍니다. (함수 재사용!)

  if (!time) {
    return `00:00:00.000000`;
  }

  const completeTime = completeLocalTime(time);

  // 2. 각 시간 단위를 두 자리 문자열로 만들고, 비는 부분은 '0'으로 채웁니다.
  const hh = String(completeTime.hour).padStart(2, "0");
  const mm = String(completeTime.minute).padStart(2, "0");
  const ss = String(completeTime.second).padStart(2, "0");

  // 3. nano는 6자리로 맞춰줍니다. (1,000,000,000 나노초 = 1초)
  // 예시 형식(.000000)은 마이크로초(백만분의 1초)이므로 nano 값을 1000으로 나눠줍니다.
  const microsecond = Math.round(completeTime.nano / 1000);
  const nnnnnn = String(microsecond).padStart(6, "0");

  // 4. 템플릿 리터럴을 사용해 최종 문자열을 조합합니다.
  return `${hh}:${mm}:${ss}.${nnnnnn}`;
};

/**
 * LocalTime 객체를 분 단위의 숫자로 변환합니다.
 */
export const timeToMinutes = (time: LocalTime | undefined): number => {
  if (!time) return -1;
  return (time.hour || 0) * 60 + (time.minute || 0);
};

/**
 * 두 LocalTime 객체가 같은 시간인지 확인합니다. (시간, 분 기준)
 */
const areTimesEqual = (
  a: LocalTime | undefined,
  b: LocalTime | undefined
): boolean => {
  return timeToMinutes(a) === timeToMinutes(b);
};

/**
 * 시간표 배열에 새로운 셀을 추가하거나, 기존 셀을 제거/분리하는 함수
 * @param existingCells 현재 시간표 배열
 * @param newCell 추가/제거/분리할 새로운 셀
 * @returns 업데이트된 새로운 시간표 배열
 */
export const updateTimetable = (
  existingCells: MakeMemberTimetableRequest[],
  newCell: MakeMemberTimetableRequest
): MakeMemberTimetableRequest[] => {
  const updatedCells = [...existingCells];

  // --- 규칙 1 & 2의 대상이 되는 기존 블록을 찾습니다. ---
  const targetIndex = updatedCells.findIndex((cell) => {
    if (cell.day !== newCell.day) return false;

    // 규칙 1: 완전히 동일한 블록 찾기
    const isExactMatch =
      areTimesEqual(cell.startTime, newCell.startTime) &&
      areTimesEqual(cell.endTime, newCell.endTime);
    // 규칙 2: 기존 블록이 새 블록을 포함하는 경우 찾기
    const isContaining =
      timeToMinutes(cell.startTime) <= timeToMinutes(newCell.startTime) &&
      timeToMinutes(cell.endTime) >= timeToMinutes(newCell.endTime);

    return isExactMatch || isContaining;
  });

  // --- 대상 블록을 찾은 경우 (제거 또는 분리) ---
  if (targetIndex !== -1) {
    const targetCell = updatedCells[targetIndex];
    // 일단 배열에서 대상 블록을 제거합니다.
    updatedCells.splice(targetIndex, 1);

    // 규칙 2 (분리) 로직: 포함 관계였지만 완전히 같지는 않은 경우
    // 즉, 기존 블록을 '분리'해야 하는 경우
    const isExactMatch =
      areTimesEqual(targetCell.startTime, newCell.startTime) &&
      areTimesEqual(targetCell.endTime, newCell.endTime);
    if (!isExactMatch) {
      // "왼쪽" 부분 생성: 기존 블록의 시작 ~ 새 블록의 시작
      if (!areTimesEqual(targetCell.startTime, newCell.startTime)) {
        updatedCells.push({
          ...targetCell,
          endTime: newCell.startTime,
        });
      }
      // "오른쪽" 부분 생성: 새 블록의 끝 ~ 기존 블록의 끝
      if (!areTimesEqual(targetCell.endTime, newCell.endTime)) {
        updatedCells.push({
          ...targetCell,
          startTime: newCell.endTime,
        });
      }
    }
    // 만약 isExactMatch가 true였다면, 그냥 제거만 하고 아무것도 추가하지 않으므로 '토글 제거'가 됩니다.

    // 분리 후에는 기존 블록들과 다시 병합될 수 있으므로, 전체 병합 로직을 한번 더 실행합니다.
    // (예: 9-12를 11-12로 자르면 9-11이 남는데, 기존에 8-9가 있었다면 합쳐져야 함)
    // 하지만 일단은 분리/제거 로직만 구현합니다. 병합까지 고려하면 매우 복잡해지므로,
    // 필요하다면 아래 '병합 로직' 부분과 결합해야 합니다.
    return updatedCells;
  }

  // --- 대상 블록이 없는 경우 (추가 및 병합) ---
  updatedCells.push(newCell);

  // 요일별 그룹화
  const groupedByDay = updatedCells.reduce((acc, cell) => {
    const day = cell.day || "UNKNOWN";
    if (!acc[day]) acc[day] = [];
    acc[day].push(cell);
    return acc;
  }, {} as Record<string, MakeMemberTimetableRequest[]>);

  const finalMergedResult: MakeMemberTimetableRequest[] = [];
  for (const day in groupedByDay) {
    const cellsForDay = groupedByDay[day];
    if (cellsForDay.length === 0) continue;

    cellsForDay.sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    let currentMerged = { ...cellsForDay[0] };
    for (let i = 1; i < cellsForDay.length; i++) {
      const nextCell = cellsForDay[i];
      if (
        timeToMinutes(currentMerged.endTime) ===
        timeToMinutes(nextCell.startTime)
      ) {
        currentMerged.endTime = nextCell.endTime;
      } else {
        finalMergedResult.push(currentMerged);
        currentMerged = { ...nextCell };
      }
    }
    finalMergedResult.push(currentMerged);
  }

  return finalMergedResult;
};
