import { sendFCMToken } from "@/apis/calendar";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";

// 1. Firebase 설정 (서비스 워커와 동일한 값)
const firebaseConfig = {
  apiKey: "AIzaSyB7f2IzatJXsuxMZk6BcPsAS5ojuRdN8ds",

  authDomain: "capstone-5f88f.firebaseapp.com",

  projectId: "capstone-5f88f",

  storageBucket: "capstone-5f88f.firebasestorage.app",

  messagingSenderId: "1094578308157",

  appId: "1:1094578308157:web:960650dda30eb3cb021654",

  measurementId: "G-K8GVY0TB1H",
};
// 2. Firebase 앱 초기화 (싱글톤 패턴 권장)
let app: FirebaseApp;
let messaging: Messaging;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.error("Firebase 초기화 오류:", error);
}

/**
 * 발급받은 FCM 토큰을 백엔드 API로 전송하여 저장합니다.
 */

/**
 * 메인 함수: 알림 권한 요청 및 토큰 발급/저장
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (!messaging) {
    console.error("Firebase Messaging이 초기화되지 않았습니다.");
    return null;
  }

  console.log("알림 권한을 요청합니다...");
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("알림 권한이 허용되었습니다.");

      // 1. 백엔드에서 VAPID 공개키 가져오기
      //   const vapidKey = await getVapidKeyFromBackend();
      const vapidKey = import.meta.env.VAPID;

      // 2. VAPID 키를 사용하여 FCM 토큰 요청
      const fcmToken = await getToken(messaging, { vapidKey: vapidKey });

      if (fcmToken) {
        // 3. FCM 토큰을 백엔드에 저장
        await sendFCMToken(fcmToken);
        console.log("FCM TOKEN :", fcmToken);
        return fcmToken;
      } else {
        console.warn(
          "FCM 토큰을 발급받지 못했습니다. 서비스 워커 등록을 확인하세요."
        );
        return null;
      }
    } else {
      console.warn("알림 권한이 거부되었습니다.");
      return null;
    }
  } catch (error) {
    console.error("알림 권한 요청 또는 토큰 발급 중 오류:", error);
    return null;
  }
};

export const deleteTokenFromBrowser = async (): Promise<boolean> => {
  if (!messaging) {
    console.error("Firebase Messaging이 초기화되지 않았습니다.");
    return false;
  }

  try {
    // 3. deleteToken 함수 실행
    await deleteToken(messaging);
    console.log("브라우저에서 FCM 토큰이 성공적으로 삭제되었습니다.");
    return true;
  } catch (error) {
    console.error("브라우저 토큰 삭제 중 오류 발생:", error);
    return false;
  }
};

/**
 * 포그라운드 메시지 핸들러
 * 앱이 활성화된 상태(사용자가 탭을 보고 있는 상태)에서 메시지를 수신합니다.
 */
export const initializeForegroundMessageListener = () => {
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log("포그라운드 메시지 수신:", payload);
      // 이 경우 브라우저 알림이 자동으로 뜨지 않습니다.
      // React 컴포넌트 내에서 직접 커스텀 알림(e.g., in-app-popup)을 띄워야 합니다.
      alert(
        `[포그라운드 알림] ${payload.notification?.title}: ${payload.notification?.body}`
      );
    });
  }
};
