import { useState } from "react";
import UpperNav from "../../../components/UpperNav";
import HistoryItem from "./HistoryItem";

const HistoryPage = () => {
    const [serachText, setSearchText] = useState("");

    const dummyHistory = [
        {
            title: "[혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025학년도 1학기 학습컨테스트 어쩌구저쩌구 긴 타이틀",
            isReviewd: false
        },
        {
            title: "[공학교육혁신사업단] 공학교육혁신 ",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025 러닝메이트 신입생",
            isReviewd: false
        },
        {
            title: "[혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: false
        },
        {
            title: "[혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025학년도 1학기 학습컨테스트 어쩌구저쩌구 긴 타이틀",
            isReviewd: false
        },
        {
            title: "[공학교육혁신사업단] 공학교육혁신 ",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025 러닝메이트 신입생",
            isReviewd: false
        },
        {
            title: "[혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: false
        },
        {
            title: "[혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025학년도 1학기 학습컨테스트 어쩌구저쩌구 긴 타이틀",
            isReviewd: false
        },
        {
            title: "[공학교육혁신사업단] 공학교육혁신 ",
            isReviewd: true
        },
        {
            title: "[혁신사업] 2025 러닝메이트 신입생",
            isReviewd: false
        },
        {
            title: "Last [혁신사업]건국대와 함께하는 사회봉사",
            isReviewd: false
        }
    ]

    const filterdHistory = dummyHistory.filter((item) => {
                                return item.title.includes(serachText);
                            })
                            
    return (
        <div className="w-full h-full pb-12">
            <UpperNav text="히스토리" />
            <div className="h-full bg-white pt-11 pl-4 pr-4 pb-11">

                <div className="flex px-4 py-[6px] justify-center items-center">
                    <div className="w-[40%] h-5 text-Labels-Primary text-base font-medium leading-snug">
                        활동 이름 검색
                    </div>

                    <input type="text" placeholder="활동 이름"
                        className="w-[90%] h-8 rounded-[8px] bg-[#EEEEEF] text-center"
                        onChange={(e) => setSearchText(e.target.value)} />
                </div>

                <div className="overflow-y-scroll no-scrollbar">

                    <div className="border-b-[0.5px] border-black py-5 mb-4">
                        {
                            filterdHistory.length === 0 ? (
                                <div className="px-4">
                                    <span className="font-bold">{serachText}</span> 을(를) 포함하는 검색결과가 없습니다.
                                </div>
                            ) : (
                                filterdHistory.map((item) => {
                                    return (
                                        <HistoryItem title={item.title} isReviewed={item.isReviewd} />
                                    )
                                })
                            )
                        }
                    </div>

                    <div>
                        {dummyHistory.map((item) => {
                            return (
                                <HistoryItem title={item.title} isReviewed={item.isReviewd} />
                            )
                        })}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default HistoryPage;