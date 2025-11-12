importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyByfJGJqNMnxJy7j9EWSDKBvTrDSo1hlH0",
  authDomain: "capstone-push-d1f0c.firebaseapp.com",
  projectId: "capstone-push-d1f0c",
  storageBucket: "capstone-push-d1f0c.firebasestorage.app",
  messagingSenderId: "567807009346",
  appId: "1:567807009346:web:6690a850704315da33c3db",
  measurementId: "G-GWQJ83W4M6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. 백그라운드 메시지 핸들러
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] 백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification?.title || "새 알림";
  const notificationOptions = {
    body: payload.notification?.body || "새로운 소식이 있습니다",
    icon: payload.notification?.icon || "/vite.svg", // public 폴더 기준
    data: payload.data, // 알림 클릭 시 사용할 데이터 (예: URL)
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// 3. 알림 클릭 이벤트 핸들러
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 알림 클릭됨:', event.notification);
  
  event.notification.close(); // 알림 닫기

  // data에 포함된 URL로 이동
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 탭이 있으면 포커스
        for (const client of clientList) {
          // URL이 동일하고, focus 메서드가 있다면
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 열린 탭이 없으면 새 창으로 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});