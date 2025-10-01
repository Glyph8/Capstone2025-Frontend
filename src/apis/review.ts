import api from "@/apis/index"
import type { CreateReviewRequest, DeleteMyReviewRequest } from "@/generated-api/Api";

/** 리뷰 조회. 디폴트 */
export const getReviewList = () => api.viewReview()
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
            // return error
        });

export const postReview = (review:CreateReviewRequest) => api.createReview(review)
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
        });

export const searchReview = (searchParam: { key: string; page?: number; size?: number; }) => api.searchReview(searchParam)
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
        });

export const getMyReviewList = () => api.viewMyReview()
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
        });

export const searchMyReview = (searchParam: { key: string; page?: number; size?: number; }) => api.searchMyReview(searchParam)
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
        });

export const deleteMyReview = (deleteReviewId: DeleteMyReviewRequest) => api.deleteMyReview(deleteReviewId)
        .then(Response => {
            console.log(Response.data)
            return Response.data.result
        })
        .catch(error => {
            console.error(error)
            throw new Error(error);
        });