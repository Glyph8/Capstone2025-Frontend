import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, onMessage, type Messaging } from "firebase/messaging";
import { toast } from "react-hot-toast";
import { firebaseConfig } from "./firebase-config"; // 방금 만든 설정 파일

let app: FirebaseApp;
let messaging: Messaging;

// Firebase 앱 초기화 (단 한 번만 실행)
try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.error("Firebase 초기화 오류:", error);
}

/**
 * 포그라운드 메시지 리스너를 초기화합니다.
 * App.tsx에서 앱 실행 시 한 번만 호출하면 됩니다.
 */
export const initializeForegroundMessageListener = () => {
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log("포그라운드 메시지 수신:", payload);
      
      const title = payload.notification?.title || "새 알림";
      const body = payload.notification?.body || "새로운 소식이 있습니다.";

      // react-hot-toast를 사용해 앱 내 토스트를 띄웁니다.
      toast.custom((t) => (
        <div
          style={{
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            cursor: 'pointer',
            opacity: t.visible ? 1 : 0,
            transition: 'all 0.3s ease',
            transform: t.visible ? 'translateY(0)' : 'translateY(-20px)',
          }}
          onClick={() => {
            // 알림 클릭 시 동작 (예: data.url로 이동)
            if (payload.data?.url) {
              window.location.href = payload.data.url;
            }
            toast.dismiss(t.id);
          }}
        >
          {/* 아이콘이 있다면 (payload.notification.icon) */}
          <img 
            src={payload.notification?.icon || "/vite.svg"} 
            alt="icon" 
            style={{ width: '40px', height: '40px', borderRadius: '8px' }} 
          />
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{body}</p>
          </div>
          <button
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999' }}
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
          >
            ✕
          </button>
        </div>
      ), {
        duration: 5000, // 5초
        position: 'top-right',
      });
    });
  }
};

// messaging 인스턴스를 훅이나 다른 파일에서 사용할 수 있도록 export
export { messaging };