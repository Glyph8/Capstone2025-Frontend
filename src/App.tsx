import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
// 1. 2단계에서 만든 파일에서 리스너 import
import { initializeForegroundMessageListener } from "./lib/firebase";
import { Toaster } from 'react-hot-toast';
// 2. (주석 해제) 알림 설정 페이지 컴포넌트
// import NotificationSettings from "./components/NotificationSettings"; 

function App() {
  // 3. 앱 실행 시 포그라운드 리스너 1회 실행
  useEffect(() => {
    initializeForegroundMessageListener();
  }, []);
  
  // 4. 기존 usePushNotifications() 훅 호출 삭제!

  return (
    <>
      {/* 5. NotificationSettings 컴포넌트 주석 해제 
           (테스트용: 실제로는 라우터 내부의 '설정' 페이지 등에 위치해야 합니다)
      */}
      {/* <NotificationSettings /> */}
     
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}

export default App;