git add README.md# Website Bán Đồ Handmade

Website thương mại điện tử bán đồ handmade với tone màu nhẹ nhàng, hỗ trợ 3 vai trò người dùng.

## Tính Năng

### 🔐 Vai Trò Người Dùng

#### Quản Trị Viên (Admin)
- ✅ Quản lý sản phẩm (thêm, xóa, sửa)
- ✅ Quản lý doanh thu
- ✅ Quản lý tài khoản người dùng
- ✅ Quản lý đơn hàng
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý khuyến mãi
- ✅ Quản lý đánh giá
- ✅ Chat box

#### Nhân Viên (Staff)
- ✅ Quản lý sản phẩm (thêm, xóa, sửa)
- ✅ Quản lý doanh thu
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý khuyến mãi
- ✅ Quản lý đánh giá
- ✅ Chat box

#### Người Dùng (Customer)
- ✅ Xem sản phẩm
- ✅ Đặt hàng
- ✅ Quản lý giỏ hàng
- ✅ Đánh giá sản phẩm (chỉ khi đã mua hàng)

## Công Nghệ Sử Dụng

### Frontend
- React + TypeScript
- Vite
- TailwindCSS (tone màu pastel/nhẹ nhàng)
- Context API
- Axios

### Backend
- Node.js + Express
- TypeScript
- MongoDB/PostgreSQL
- JWT Authentication
- Socket.io (cho chat box)

## Cài Đặt

### Yêu Cầu
- Node.js >= 16.x
- npm hoặc yarn
- MongoDB hoặc PostgreSQL

### Cài Đặt Client

```bash
cd client
npm install
npm run dev
```

### Cài Đặt Server

```bash
cd server
npm install
npm run dev
```

## Cấu Trúc Thư Mục

```
handmade-store/
├── client/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/   # Các component
│   │   ├── pages/        # Các trang
│   │   ├── services/     # API services
│   │   └── context/      # Context API
│   └── package.json
├── server/          # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/  # Controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Middleware
│   └── package.json
└── README.md
```

## Biến Môi Trường

### Server (.env)
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```

## Giao Diện

- Tone màu: Pastel, nhẹ nhàng, ấm áp
- Phù hợp với sản phẩm handmade
- Responsive design

## Quy Tắc Đánh Giá

- Người dùng chỉ có thể đánh giá sản phẩm khi đã mua hàng
- Mỗi người dùng chỉ đánh giá 1 lần cho mỗi sản phẩm

## License

MIT

## Liên Hệ

- Email: support@handmade-store.com
- Website: https://handmade-store.com