# Sử dụng image Node chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /backend

# Sao chép file package.json và lock để cài đặt deps
COPY package*.json ./

# Cài cả devDependencies (để có thể build)
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Build project (ví dụ TypeScript -> dist)
RUN npm run build

# Xóa devDependencies sau khi build để giảm size
RUN npm prune --production

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Mở port
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "start"]