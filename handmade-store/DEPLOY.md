# Handmade Store - Deployment Guide

## Triển khai Backend trên Render

### Bước 1: Tạo MongoDB Atlas Database
1. Truy cập https://www.mongodb.com/atlas
2. Đăng ký/Đăng nhập tài khoản
3. Tạo cluster mới (chọn FREE tier)
4. Tạo Database User và ghi nhớ username, password
5. Trong Network Access, thêm IP: `0.0.0.0/0` (cho phép tất cả)
6. Copy connection string: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/handmade-store`

### Bước 2: Deploy Backend lên Render
1. Truy cập https://render.com
2. Đăng ký/Đăng nhập bằng GitHub
3. Click "New" → "Web Service"
4. Kết nối repo GitHub: `lekhanhduy0411/tiemlen`
5. Cấu hình:
   - **Name**: handmade-store-api
   - **Root Directory**: `handmade-store/server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Thêm Environment Variables:
   - `MONGODB_URI` = connection string từ MongoDB Atlas
   - `JWT_SECRET` = một chuỗi bí mật (ví dụ: `handmade_jwt_secret_key_2026`)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
7. Click "Create Web Service"
8. Đợi deploy xong, copy URL (ví dụ: `https://handmade-store-api.onrender.com`)

## Triển khai Frontend trên Vercel

### Bước 1: Deploy Frontend
1. Truy cập https://vercel.com
2. Đăng ký/Đăng nhập bằng GitHub
3. Click "Add New" → "Project"
4. Import repo: `lekhanhduy0411/tiemlen`
5. Cấu hình:
   - **Root Directory**: `handmade-store/client`
   - **Framework Preset**: Vite
6. Thêm Environment Variables:
   - `VITE_API_URL` = `https://handmade-store-api.onrender.com/api` (URL backend từ Render)
7. Click "Deploy"

## Tài khoản mặc định
Sau khi seed database, bạn có thể đăng nhập với:
- **Admin**: admin@handmade.com / admin123
- **Staff**: staff@handmade.com / staff123
- **Customer**: customer@handmade.com / customer123

## Seed Database
Sau khi backend đã deploy, chạy seed để tạo dữ liệu mẫu:
```bash
cd handmade-store/server
npm run seed
```

Hoặc bạn có thể seed từ local bằng cách:
1. Sửa file `.env` trong server, đổi `MONGODB_URI` thành connection string của MongoDB Atlas
2. Chạy `npm run seed`
