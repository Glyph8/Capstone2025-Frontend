import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage.tsx";
import SignupPage from "../pages/auth/SignupPage.tsx";
import NotFound from "../pages/NotFound.tsx";
import AuthLayout from "../layouts/AuthLayout.tsx";
import LandingPage from "../pages/auth/LandingPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import TimeTablePage from "../pages/timetable/TimeTablePage.tsx";
import CalenderPage from "../pages/calender/CalenderPage.tsx";
import ReviewPage from "../pages/review/ReviewPage.tsx";
import MyPage from "../pages/mypage/MyPage.tsx";
import SetInterestPage from "../pages/auth/SetInterestPage.tsx";
import SetAcademicInfoPage from "../pages/auth/SetAcademicInfoPage.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/auth" replace />,
        errorElement: <NotFound />,
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: '',
                // index: true,
                element: <LandingPage />
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'signup',
                element: <SignupPage />
            },
            {
                path: 'interest',
                element: <SetInterestPage />
            },
            {
                path: 'academic-info',
                element: <SetAcademicInfoPage />
            },
        ]
    },
    {
        path: 'main',
        element: <MainLayout />,
        children: [
            {
                path: 'calender',
                element: <CalenderPage />
            },
            {
                path: 'review',
                element: <ReviewPage />
            },
            {
                path: 'timetable',
                element: <TimeTablePage />
            },
            {
                path: 'mypage',
                element: <MyPage />
            }

        ]
    }


])

export default router