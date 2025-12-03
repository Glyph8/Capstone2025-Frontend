import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
import { initializeForegroundMessageListener } from "./lib/firebase";
import { Toaster } from 'react-hot-toast';

function App() {
  // 앱 실행 시 포그라운드 리스너 1회 실행
  useEffect(() => {
    initializeForegroundMessageListener();
  }, []);
  
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}

export default App;