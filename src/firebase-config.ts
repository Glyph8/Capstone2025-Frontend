// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase 프로젝트 설정 (Firebase 콘솔에서 가져오세요)
const firebaseConfig = {
  apiKey: "AIzaSyByfJGJqNMnxJy7j9EWSDKBvTrDSo1hlH0",
  authDomain: "capstone-push-d1f0c.firebaseapp.com",
  projectId: "capstone-push-d1f0c",
  storageBucket: "capstone-push-d1f0c.firebasestorage.app",
  messagingSenderId: "567807009346",
  appId: "1:567807009346:web:6690a850704315da33c3db",
  measurementId: "G-GWQJ83W4M6",
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
