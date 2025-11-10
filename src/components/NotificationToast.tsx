import React, { useEffect, useState } from 'react';

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  data?: any;
}

interface Toast extends NotificationData {
  id: number;
}

const NotificationToast: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // 포어그라운드 알림 이벤트 리스너
    const handleForegroundNotification = (event: CustomEvent<NotificationData>) => {
      const notification = event.detail;
      
      const newToast: Toast = {
        id: Date.now(),
        ...notification,
      };

      setToasts((prev) => [...prev, newToast]);

      // 5초 후 자동으로 제거
      setTimeout(() => {
        removeToast(newToast.id);
      }, 5000);
    };

    window.addEventListener('foregroundNotification', handleForegroundNotification as EventListener);

    return () => {
      window.removeEventListener('foregroundNotification', handleForegroundNotification as EventListener);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleToastClick = (toast: Toast) => {
    if (toast.data?.url) {
      window.location.href = toast.data.url;
    }
    removeToast(toast.id);
  };

  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            transform: `translateY(${index * 10}px)`,
            zIndex: 10000 - index,
          }}
          onClick={() => handleToastClick(toast)}
        >
          <button
            style={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
          >
            ✕
          </button>

          {toast.icon && (
            <img src={toast.icon} alt="icon" style={styles.icon} />
          )}

          <div style={styles.content}>
            <h4 style={styles.title}>{toast.title}</h4>
            <p style={styles.body}>{toast.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
  },
  toast: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'slideIn 0.3s ease',
    position: 'relative',
    border: '1px solid #e0e0e0',
  },
  closeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#999',
    padding: '4px 8px',
    lineHeight: 1,
  },
  icon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    paddingRight: '20px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.4,
  },
};

// 애니메이션 스타일을 head에 추가
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default NotificationToast;