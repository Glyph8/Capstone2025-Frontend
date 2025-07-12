import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import LowerNavIcon from "./LowerNavIcon";

type MenuType = 'calendar' | 'review' | 'mypage' | 'timetable';

const CALENDAR_PATH = '/main/calender';
const REVIEW_PATH = '/main/review';
const MYPAGE_PATH = '/main/mypage';
const TIMETABLE_PATH = '/main/timetable'

const menuMap: Record<string, MenuType> = {
    [CALENDAR_PATH]: 'calendar',
    [REVIEW_PATH]: 'review',
    [MYPAGE_PATH]: 'mypage',
    [TIMETABLE_PATH]: 'timetable',
};

const LowerNav = () => {

    const [selectedMenu, setSelectedMenu] = useState<MenuType>('timetable')
    const location = useLocation();

    useEffect(() => {
        const selected = menuMap[location.pathname];
        if (selected) {
            setSelectedMenu(selected);
        }
        console.log(selected)
    }, [location.pathname]);

    return (
        <div className="w-full h-16 flex flex-row justify-between items-center bg-[#f4f4f4
        shadow-[0px_0.20000000298023224px_2px_0px_rgba(0,0,0,0.25)] pl-14 pr-14">

            <LowerNavIcon
                imageOnSrc="/icons/calender-icon-on.svg" imageOffSrc="/icons/calender-icon-off.svg"
                isSelected={selectedMenu === 'calendar'} text="캘린더" />

            <LowerNavIcon
                imageOnSrc="/icons/review-icon-on.svg" imageOffSrc="/icons/review-icon-off.svg"
                isSelected={selectedMenu === 'review'} text="리뷰" />

            <LowerNavIcon
                imageOnSrc="/icons/timetable-icon-on.svg" imageOffSrc="/icons/timetable-icon-off.svg"
                isSelected={selectedMenu === 'timetable'} text="시간표" />

            <LowerNavIcon
                imageOnSrc="/icons/mypage-icon-on.svg" imageOffSrc="/icons/mypage-icon-off.svg"
                isSelected={selectedMenu === 'mypage'} text="마이" />

        </div>
    )
}

export default LowerNav