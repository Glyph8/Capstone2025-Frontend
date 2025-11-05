import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
import { initializeForegroundMessageListener } from "./lib/firebase";
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    initializeForegroundMessageListener();
  }, []);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center" // 위치 (e.g., top-center, bottom-left)
        reverseOrder={false}  // 알림이 쌓이는 순서
      />
    </>
  );
}

export default App;
