// Firebase v9 compat 라이브러리를 사용해야 서비스 워커에서 안정적으로 동작합니다.
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

// 1. Firebase 프로젝트 설정 (Firebase 콘솔에서 가져오세요)
const firebaseConfig = {
  apiKey: "AIzaSyB7f2IzatJXsuxMZk6BcPsAS5ojuRdN8ds",
  authDomain: "capstone-5f88f.firebaseapp.com",
  projectId: "capstone-5f88f",
  storageBucket: "capstone-5f88f.firebasestorage.app",
  messagingSenderId: "1094578308157",
  appId: "1:1094578308157:web:960650dda30eb3cb021654",
  measurementId: "G-K8GVY0TB1H",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 2. 백그라운드 메시지 핸들러
// 앱이 탭에 열려있지 않거나 브라우저가 최소화된 경우 이 핸들러가 호출됩니다.
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // 브라우저 알림(토스트)을 직접 띄웁니다.
  const notificationTitle = payload.notification.title || "새 알림";
  const notificationOptions = {
    body: payload.notification.body || "새로운 소식이 있습니다",
    icon: "/vite.svg", // public 폴더 내의 아이콘 경로
  };

  // self.registration은 서비스 워커 자신을 가리킵니다.
  return self.registration.showNotification(notificationTitle, notificationOptions);
});