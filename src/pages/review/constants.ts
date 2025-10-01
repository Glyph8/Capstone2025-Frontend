import type { PageResponseReviewResponse } from "@/generated-api/Api";
import type { RatingValue } from "@/types/review-types";

export const dummyReviewList : PageResponseReviewResponse = {
    data: [
        {
            reviewId: 1,
            extracurricularId: 2,
            content: "좋아요!",
            star: "FIVE"
        },
        {
            reviewId: 3,
            extracurricularId: 4,
            content: "좋아요!",
            star: "TWO"
        },
        {
            reviewId: 5,
            extracurricularId: 6,
            content: "3좋아요!",
            star: "THREE"
        },
        {
            reviewId: 7,
            extracurricularId: 8,
            content: "안좋아요!",
            star: "FOUR"
        }
    ],
    "totalPages": 1,
    "isLastPage": true
}

export const RATING_MAP: { [key in RatingValue]: number } = {
  "ONE": 1,
  "TWO": 2,
  "THREE": 3,
  "FOUR": 4,
  "FIVE": 5,
};