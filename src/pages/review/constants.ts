import type { RatingValue } from "@/types/review-types";

export const RATING_MAP: { [key in RatingValue]: number } = {
  "ONE": 1,
  "TWO": 2,
  "THREE": 3,
  "FOUR": 4,
  "FIVE": 5,
};