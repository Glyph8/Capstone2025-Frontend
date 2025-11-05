import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
import { initializeForegroundMessageListener } from "./lib/firebase";

function App() {
  useEffect(() => {
    initializeForegroundMessageListener();
  }, []); 
  return (
    <RouterProvider router={router} />
  );
}

export default App
