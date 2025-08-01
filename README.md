# MERN TypeScript Application

Ứng dụng MERN Stack được xây dựng với TypeScript

## 🚀 Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** với TypeScript
- **MongoDB** với Mongoose ODM
- **JWT** Authentication với bcryptjs
- **Winston** logging system với file rotation
- **Express Validator** cho request validation
- **Helmet**, **CORS**, **Rate Limiting** cho bảo mật
- **BaseController** pattern cho standardized responses
- **BaseService** pattern cho data access layer

### Frontend  
- **React 19** + **TypeScript** với Vite
- **TailwindCSS v4** + **DaisyUI** cho giao diện
- **React Router v7** cho routing
- **Axios** cho HTTP client  
- **React Hot Toast** cho notifications
- **Zustand** cho state management
- **Lucide React** cho icons

## 📁 Cấu trúc dự án

```
app-core/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & CORS configuration
│   │   ├── controllers/     # API controllers (BaseController pattern)
│   │   ├── middleware/      # Authentication, logging, rate limiting
│   │   ├── models/          # MongoDB models với Mongoose
│   │   ├── routes/          # API routes definition
│   │   ├── services/        # Business logic layer (BaseService pattern)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utilities (JWT, Logger)
│   │   ├── request/         # Request validation schemas
│   │   └── server.ts        # Main server entry point
│   ├── logs/                # Winston log files
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── configs/         # Application configurations
│   │   ├── hooks/           # Custom React hooks
│   │   ├── model/           # TypeScript interfaces
│   │   ├── pages/           # Page components
│   │   ├── routers/         # React Router configuration
│   │   ├── services/        # API services (Axios)
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   ├── package.json
│   ├── tailwind.config.js   # TailwindCSS v4 configuration
│   ├── vite.config.ts       # Vite configuration
│   └── eslint.config.js     # ESLint configuration
├── start.sh                 # Application startup script
└── README.md
```

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.x
- MongoDB (cài đặt local hoặc sử dụng MongoDB Atlas)
- npm hoặc yarn

### Quick Start (Khuyến nghị)

1. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd app-core
   ```

2. **Cài đặt dependencies cho toàn bộ dự án:**
   ```bash
   npm run install:all
   ```

3. **Chạy ứng dụng:**
   ```bash
   ./start.sh
   ```

   Script này sẽ:
   - Cài đặt dependencies nếu chưa có
   - Khởi động Backend và Frontend
   - Hiển thị thông tin kết nối

### Cài đặt thủ công

#### 1. Cài đặt Backend
```bash
cd backend
npm install
```

#### 2. Cài đặt Frontend  
```bash
cd frontend
npm install
```

#### 3. Cấu hình Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/mern-ts-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

**Frontend (.env):**
```env
APP_NAME=AppCore
APP_VERSION=1.0.0
APP_PORT=3000
APP_API_URL=http://localhost:5001/api
```


#### 5. Chạy ứng dụng

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend  
npm run dev
```

Ứng dụng sẽ chạy tại:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:5001 (Express server)
- **API**: http://localhost:5001/api
- **MongoDB**: mongodb://localhost:27017/mern-ts-app

## 📚 API Endpoints

### Health Check
- `GET /health` - Kiểm tra trạng thái server và database
- `GET /api/` - Welcome message

### Authentication (Planned)
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập  
- `GET /api/auth/profile` - Lấy thông tin profile (cần token)

### User Management (Planned)
- `GET /api/users` - Lấy danh sách users (có pagination)
- `GET /api/users/stats` - Thống kê users (admin only)
- `GET /api/users/:id` - Lấy thông tin user theo ID
- `PUT /api/users/:id` - Cập nhật thông tin user
- `PATCH /api/users/:id/deactivate` - Vô hiệu hóa user (admin only)
- `PATCH /api/users/:id/activate` - Kích hoạt user (admin only)

## ✨ Tính năng hiện tại

### Backend Features ✅
- **BaseController** pattern với standardized API responses
- **BaseService** pattern cho data access layer
- Class-based Controllers với async error handling
- JWT utilities (generate/verify/decode tokens)
- User model với password hashing (bcrypt)
- Request validation schemas (login/register)
- Winston logging system với file rotation
- Rate limiting middleware (100 requests/15 phút)
- Security headers với Helmet
- CORS configuration với whitelist domains
- Database connection management với singleton pattern
- Error handling middleware
- TypeScript path aliases cho clean imports

### Frontend Features ✅
- **React 19** với TypeScript và Vite
- **TailwindCSS v4** + **DaisyUI** components
- **React Router v7** với type-safe routing
- Axios client với interceptors
- React Hot Toast notifications
- Zustand store setup (configured but empty)
- Custom hooks setup (structure ready)
- Responsive pages (Home, About, Contact, Profile, Create, NotFound)
- ESLint configuration với TypeScript rules

### Architecture Features ✅
- Modular project structure
- Environment configuration templates
- Automated startup script (`start.sh`)
- TypeScript configuration với path mapping
- Git ignore files properly configured

## 🔐 Authentication Flow (Architecture Ready)

Dự án đã chuẩn bị sẵn architecture cho authentication:

1. **JWT Utilities** - Hoàn chỉnh với generate/verify/decode tokens
2. **User Model** - Mongoose schema với password hashing
3. **Auth Middleware** - Authentication & authorization middleware
4. **Request Validation** - Login/register validation schemas
5. **BaseController** - Standardized response formats

**Cần implement:**
- Auth routes và controllers
- Frontend auth context và protected routes
- Login/register forms

## 📝 Logging System

Backend sử dụng Winston để ghi log với cấu hình production-ready:

**Log Files:**
- `logs/error.log` - Chỉ log errors (max 5MB, 5 files)
- `logs/combined.log` - Tất cả log levels (max 5MB, 5 files)
- Console output trong development mode với colors

**Log Levels:**
- Production: `info` trở lên
- Development: `debug` trở lên

**Features:**
- Automatic file rotation
- Structured JSON logging
- Request logging middleware
- Error stack traces
- Service identification

## 🧪 Testing

```bash
# Backend testing với Jest
cd backend
npm test

# Frontend testing (setup ready)
cd frontend  
npm test
```

**Test files hiện có:**
- `backend/src/utils/jwt.test.ts` - JWT utilities testing

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build  # TypeScript compilation với ttsc
npm start      # Production server
```

### Frontend Deployment  
```bash
cd frontend
npm run build  # Vite build với TypeScript compilation
npm run preview # Preview production build
```

##  Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ developer.

## 📄 License

MIT License

## 🏗️ BaseController Architecture

Backend sử dụng BaseController pattern để chuẩn hóa API responses:

### Cấu trúc Response chuẩn
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

### Ví dụ sử dụng trong Controller
```typescript
export class MyController extends BaseController {
  public getItems = this.asyncHandler(async (req: Request, res: Response) => {
    const items = await ItemModel.find();
    this.sendSuccess(res, items, 'Items retrieved successfully');
  });
  
  public createItem = this.asyncHandler(async (req: Request, res: Response) => {
    const item = new ItemModel(req.body);
    await item.save();
    this.sendCreated(res, { item }, 'Item created successfully');
  });
}
```

### Các phương thức có sẵn
- `sendSuccess(res, data, message, 200)` - Response thành công
- `sendCreated(res, data, message)` - Tạo mới thành công (201)
- `sendSuccessWithPagination()` - Thành công với phân trang
- `sendError(res, message, statusCode, errors)` - Lỗi chung
- `sendValidationError(res, errors)` - Lỗi validation (400)
- `sendNotFound(res, message)` - Không tìm thấy (404)
- `sendUnauthorized(res, message)` - Không có quyền (401)
- `sendForbidden(res, message)` - Bị cấm (403)
- `sendConflict(res, message)` - Xung đột dữ liệu (409)
- `sendInternalError(res, error)` - Lỗi server (500)
- `sendNoContent(res)` - No content (204)
- `asyncHandler(fn)` - Wrapper tự động bắt lỗi async

## 🏗️ BaseService Architecture

Backend sử dụng BaseService pattern cho data access layer:

### Features
- Generic CRUD operations
- Pagination support
- Query filtering
- Bulk operations
- Error handling với logging
- Validation integration

### Ví dụ sử dụng
```typescript
export class UserService extends BaseService<IUser> {
  constructor() {
    super(User); // Mongoose model
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async searchUsers(query: string): Promise<IUser[]> {
    const searchRegex = new RegExp(query, 'i');
    return await this.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    });
  }
}
```

## 🎯 Next Steps

Dự án đã có architecture hoàn chỉnh, các bước tiếp theo:

### Backend Tasks
- [ ] Implement Auth routes (register/login/profile)
- [ ] Connect User routes với authentication
- [ ] Add more business logic routes
- [ ] Implement data validation cho tất cả routes
- [ ] Add unit tests cho services và controllers

### Frontend Tasks  
- [ ] Implement Auth context và protected routes
- [ ] Create login/register forms
- [ ] Build dashboard và user management UI
- [ ] Add form validation với react-hook-form
- [ ] Implement error handling và loading states
- [ ] Add internationalization (i18n)

### DevOps Tasks
- [ ] Setup CI/CD pipeline
- [ ] Add environment-specific configurations
- [ ] Add backup strategies cho MongoDB

## 🎯 Development Scripts

Dự án cung cấp các scripts tiện ích:

### Root Level Scripts
```bash
npm run dev              # Chạy ./start.sh - automated startup
npm run install:all      # Cài đặt deps cho backend + frontend
npm run build           # Build backend + frontend
npm run start           # Start production backend
```

### Backend Scripts
```bash
npm run dev             # Development với ts-node và hot reload
npm run build           # Compile TypeScript với ttsc
npm run start           # Start production server
npm test               # Run Jest tests
```

### Frontend Scripts  
```bash
npm run dev             # Vite dev server với hot reload
npm run build           # Production build với type checking
npm run preview         # Preview production build
npm run lint            # ESLint checking
```

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ developer.

## 📄 License

MIT License
