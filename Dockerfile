FROM node:18-alpine

WORKDIR /app

# Copy package.json của backend
COPY backend/package*.json ./backend/

# Cài đặt dependencies
WORKDIR /app/backend
RUN npm install

# Copy toàn bộ source code
WORKDIR /app
COPY . .

# Build trong folder backend
WORKDIR /app/backend
RUN npm run build
RUN npm prune --production

# Env
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]