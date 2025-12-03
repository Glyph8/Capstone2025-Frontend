import api from "@/apis/index";
import type {
  CreateReviewRequest,
  DeleteMyReviewRequest,
} from "@/generated-api/Api";

/** 리뷰 조회. 디폴트 */
export const getReviewList = () =>
  api
    .viewReview()
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
      // return error
    });

/** 리뷰 쓰기 */
export const postReview = (review: CreateReviewRequest) =>
  api
    .createReview(review)
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

/** 리뷰 검색하기 */
export const searchReview = (searchParam: {
  key: string;
  page?: number;
  size?: number;
}) =>
  api
    .searchReview(searchParam)
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

/** 내가 쓴 리뷰 리스트 조회하기 */
export const getMyReviewList = () =>
  api
    .viewMyReview()
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

/** 내가 쓴 리뷰 검색하기 */
export const searchMyReview = (searchParam: {
  key: string;
  page?: number;
  size?: number;
}) =>
  api
    .searchMyReview(searchParam)
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

/** 내가 쓴 리뷰 삭제하기 */
export const deleteMyReview = (deleteReviewId: DeleteMyReviewRequest) =>
  api
    .deleteMyReview(deleteReviewId)
    .then((Response) => {
      console.log(Response.data);
      return Response.data.result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
