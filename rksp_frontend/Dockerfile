# Базовый образ (Node.js с Alpine Linux для уменьшения размера)
FROM node:18-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) из подкаталога rksp_frontend
COPY ./rksp_frontend/package*.json ./rksp_frontend/

# Переходим в директорию проекта, где лежат package.json и package-lock.json
WORKDIR /app/rksp_frontend

# Устанавливаем зависимости для проекта
RUN npm install

# Копируем все файлы проекта в рабочую директорию контейнера
COPY ./rksp_frontend /app/rksp_frontend/

# Собираем приложение (здесь предполагается, что проект использует npm run build)
RUN npm run build

# Порт, который будет слушать React (обычно 3000)
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
