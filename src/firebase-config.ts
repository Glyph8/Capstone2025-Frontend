// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase 프로젝트 설정 (Firebase 콘솔에서 가져오세요)
const firebaseConfig = {
  apiKey: "AIzaSyB7f2IzatJXsuxMZk6BcPsAS5ojuRdN8ds",
  authDomain: "capstone-5f88f.firebaseapp.com",
  projectId: "capstone-5f88f",
  storageBucket: "capstone-5f88f.firebasestorage.app",
  messagingSenderId: "1094578308157",
  appId: "1:1094578308157:web:960650dda30eb3cb021654",
  measurementId: "G-K8GVY0TB1H",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
// Messaging 인스턴스 가져오기
export const messaging = getMessaging(app);

// 환경 변수에서 VAPID 키 가져오기
export const vapidKey = import.meta.env.VITE_APP_VAPID_KEY;

if (!vapidKey) {
  console.error("VAPID 키가 .env 파일에 설정되지 않았습니다.");
}