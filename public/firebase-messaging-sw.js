// Firebase v9 compat 라이브러리를 사용해야 서비스 워커에서 안정적으로 동작합니다.
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

// 1. Firebase 프로젝트 설정 (Firebase 콘솔에서 가져오세요)
const firebaseConfig = {
  apiKey: "AIzaSyByfJGJqNMnxJy7j9EWSDKBvTrDSo1hlH0",
  authDomain: "capstone-push-d1f0c.firebaseapp.com",
  projectId: "capstone-push-d1f0c",
  storageBucket: "capstone-push-d1f0c.firebasestorage.app",
  messagingSenderId: "567807009346",
  appId: "1:567807009346:web:6690a850704315da33c3db",
  measurementId: "G-GWQJ83W4M6",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 2. 백그라운드 메시지 핸들러
// 앱이 탭에 열려있지 않거나 브라우저가 최소화된 경우 이 핸들러가 호출됩니다.
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] 백그라운드 메시지 수신:', payload);

  // 브라우저 알림(토스트)을 직접 띄웁니다.
  const notificationTitle = payload.notification.title || "새 알림";
  const notificationOptions = {
    body: payload.notification.body || "새로운 소식이 있습니다",
    icon: "/vite.svg", // public 폴더 내의 아이콘 경로
  };

  // self.registration은 서비스 워커 자신을 가리킵니다.
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 알림 클릭됨:', event.notification);
  
  event.notification.close(); // 알림 닫기

  // 특정 URL로 이동하거나 앱 포커스
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있으면 포커스
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});