# Stage 1: build the React app
FROM node:18-alpine AS build
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY ./rksp_frontend/package*.json ./
RUN npm install

# Копируем весь исходный код и собираем
COPY ./rksp_frontend ./
RUN npm run build

# Stage 2: use Nginx to serve the app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Render ожидает, что приложение слушает на 80 порту
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
