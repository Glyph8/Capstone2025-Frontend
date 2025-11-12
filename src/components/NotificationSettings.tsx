// import { usePushNotifications } from '@/hooks/usePushNotifications';
// import React from 'react';

// const NotificationSettings: React.FC = () => {
//   const {
//     isSupported,
//     permission,
//     isLoading,
//     error,
//     requestPermission,
//     subscribeToNotifications,
//   } = usePushNotifications();

//   const handleEnableNotifications = async () => {
//     // 1단계: 권한 요청
//     await requestPermission();
    
//     // 2단계: 권한이 허용되면 구독
//     if (Notification.permission === 'granted') {
//       await subscribeToNotifications();
//     }
//   };

//   if (!isSupported) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>푸시 알림</h2>
//           <p style={styles.errorText}>
//             이 브라우저는 푸시 알림을 지원하지 않습니다.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>푸시 알림 설정</h2>
        
//         <div style={styles.statusSection}>
//           <p style={styles.label}>현재 상태:</p>
//           <span style={getStatusStyle(permission)}>
//             {getPermissionText(permission)}
//           </span>
//         </div>

//         {error && (
//           <div style={styles.errorBox}>
//             <p style={styles.errorText}>{error}</p>
//           </div>
//         )}

//         <div style={styles.buttonGroup}>
//           {permission === 'default' && (
//             <button
//               onClick={handleEnableNotifications}
//               disabled={isLoading}
//               style={styles.button}
//             >
//               {isLoading ? '처리 중...' : '알림 허용하기'}
//             </button>
//           )}

//           {permission === 'granted' && (
//             <button
//               onClick={subscribeToNotifications}
//               disabled={isLoading}
//               style={styles.button}
//             >
//               {isLoading ? '구독 중...' : '푸시 알림 구독'}
//             </button>
//           )}

//           {permission === 'denied' && (
//             <div style={styles.deniedBox}>
//               <p style={styles.deniedText}>
//                 알림이 차단되었습니다. 브라우저 설정에서 알림 권한을 허용해주세요.
//               </p>
//               <button
//                 onClick={() => window.location.reload()}
//                 style={styles.secondaryButton}
//               >
//                 새로고침
//               </button>
//             </div>
//           )}
//         </div>

//         <div style={styles.infoBox}>
//           <h3 style={styles.infoTitle}>푸시 알림이란?</h3>
//           <ul style={styles.infoList}>
//             <li>중요한 업데이트를 실시간으로 받을 수 있습니다</li>
//             <li>브라우저가 닫혀있어도 알림을 받을 수 있습니다</li>
//             <li>언제든지 설정에서 알림을 끌 수 있습니다</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 권한 상태에 따른 텍스트
// const getPermissionText = (permission: NotificationPermission): string => {
//   switch (permission) {
//     case 'granted':
//       return '허용됨 ✓';
//     case 'denied':
//       return '차단됨 ✗';
//     default:
//       return '미설정';
//   }
// };

// // 권한 상태에 따른 스타일
// const getStatusStyle = (permission: NotificationPermission): React.CSSProperties => {
//   const baseStyle: React.CSSProperties = {
//     padding: '6px 12px',
//     borderRadius: '4px',
//     fontWeight: 'bold',
//     fontSize: '14px',
//   };

//   switch (permission) {
//     case 'granted':
//       return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
//     case 'denied':
//       return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
//     default:
//       return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
//   }
// };

// // 스타일
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     maxWidth: '600px',
//     margin: '40px auto',
//     padding: '20px',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: '8px',
//     padding: '30px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   title: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     marginBottom: '20px',
//     color: '#333',
//   },
//   statusSection: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     marginBottom: '20px',
//   },
//   label: {
//     fontSize: '16px',
//     color: '#666',
//     margin: 0,
//   },
//   buttonGroup: {
//     marginTop: '20px',
//   },
//   button: {
//     width: '100%',
//     padding: '12px 24px',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     color: '#ffffff',
//     backgroundColor: '#007bff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },
//   secondaryButton: {
//     padding: '10px 20px',
//     fontSize: '14px',
//     color: '#007bff',
//     backgroundColor: '#ffffff',
//     border: '2px solid #007bff',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
//   errorBox: {
//     backgroundColor: '#f8d7da',
//     border: '1px solid #f5c6cb',
//     borderRadius: '6px',
//     padding: '12px',
//     marginBottom: '20px',
//   },
//   errorText: {
//     color: '#721c24',
//     margin: 0,
//     fontSize: '14px',
//   },
//   deniedBox: {
//     backgroundColor: '#fff3cd',
//     border: '1px solid #ffeeba',
//     borderRadius: '6px',
//     padding: '16px',
//   },
//   deniedText: {
//     color: '#856404',
//     margin: '0 0 10px 0',
//     fontSize: '14px',
//   },
//   infoBox: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: '6px',
//     padding: '16px',
//     marginTop: '24px',
//   },
//   infoTitle: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//     marginBottom: '10px',
//     color: '#333',
//   },
//   infoList: {
//     margin: 0,
//     paddingLeft: '20px',
//     color: '#666',
//     fontSize: '14px',
//     lineHeight: '1.6',
//   },
// };

// export default NotificationSettings;