import { RouterProvider } from "react-router-dom";
import router from "./routes";
// import { useEffect } from "react";
// import { initializeForegroundMessageListener } from "./lib/firebase_v1";
import { Toaster } from 'react-hot-toast';
import { usePushNotifications } from "./hooks/usePushNotification";
// import NotificationToast from "./components/NotificationToast";
// import NotificationSettings from "./components/NotificationSettings";

function App() {
  usePushNotifications();
  // useEffect(() => {
  //   initializeForegroundMessageListener();
  // }, []);
  return (
    <>
    {/* <NotificationToast /> */}
     {/* <NotificationSettings /> */}
     
      <RouterProvider router={router} />
      <Toaster 
        position="top-center" // 위치 (e.g., top-center, bottom-left)
        reverseOrder={false}  // 알림이 쌓이는 순서
      />
    </>
  );
}

export default App;
