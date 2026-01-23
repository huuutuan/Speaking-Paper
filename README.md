# Speaking-Paper
3.1	Yêu cầu môi trường 
Để triển khai và vận hành hệ thống, cần chuẩn bị các thành phần sau:
•	Hệ điều hành: Windows 10/11, Linux (Ubuntu/Debian) hoặc macOS
•	Node.js: phiên bản 18 trở lên
•	MongoDB: MongoDB Community Server hoặc MongoDB Atlas
•	Python: phiên bản 3.9 trở lên (dùng cho dịch vụ Text-to-Speech và Summarization)
•	Trình duyệt web: Chrome, Edge hoặc Firefox
•	Thiết bị di động: Android/iOS (nếu chạy app Expo trên thiết bị thật)
"@tanstack/react-query": "^5.90.12",
"expo": "~54.0.30",
"expo-av": "~16.0.8",
"expo-router": "~6.0.21",

3.2	Cài đặt Backend
•	npm install (depedencies)
•	Cấu hình biến môi trường (.env)
o	PORT=3000
o	MONGO_URL=mongodb://username:password@localhost:27017/newsDB
o	JWT_SECRET=your_secret_key		
npm run dev chạy backend
o	Cài đặt ngrok (ngrok | API Gateway, Kubernetes Ingress, Webhook Gateway)
o	Mở terminal ngrok http 3000
o	Sau đó vào env trỏ liên kết ngrok+callbackurl vào localhost:3000
o	Phần sumarry tạo virtual Env rồi tải depedency rồi uvicorn api:app –reload
3.3	Đăng ký Api TTS tại vbee.vn
3.4	Cài đặt frontend
Cài đặt Expo CLI  npm install -g expo-cli
npm install
expo start
