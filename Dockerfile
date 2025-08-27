# Sử dụng image Node chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /backend

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install --production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Thiết lập biến môi trường cho Northflank (nếu cần)
ENV NODE_ENV=production

# Mở port ứng dụng (thường dùng 3000)
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]