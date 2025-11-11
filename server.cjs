// server.js
const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch'); // Node.js 18 미만이면 설치 필요

const app = express();
app.use(cors()); // CORS 허용
app.use(express.json());

const SERVER_KEY = 'YOUR_SERVER_KEY'; // Firebase Console에서 가져온 Server Key (AAAA...로 시작)

app.post('/api/send-notification', async (req, res) => {
  const { token, title, body, data } = req.body;

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=AIzaSyByfJGJqNMnxJy7j9EWSDKBvTrDSo1hlH0`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body,
          icon: '/icon.png'
        },
        data: data || {}
      })
    });

    const responseData = await response.json();
    
    if (response.ok) {
      res.json({ success: true, data: responseData });
    } else {
      res.status(response.status).json({ success: false, error: responseData });
    }
  } catch (error) {
    console.error('FCM 전송 오류:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`푸시 알림 서버 실행 중: http://localhost:${PORT}`);
});