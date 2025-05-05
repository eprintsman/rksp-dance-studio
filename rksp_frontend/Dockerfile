# Базовый образ (Node.js с Alpine Linux для уменьшения размера)
FROM node:18-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем приложение (опционально, если используете билд)
RUN npm run build

# Порт, который будет слушать React (обычно 3000)
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]