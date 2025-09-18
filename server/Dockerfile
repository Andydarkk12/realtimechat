# FROM node:20  AS builder

# RUN apt update && apt install -y python3 make g++

# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# CMD ["node", "./server.js"]
FROM node:20

# Устанавливаем необходимые сборочные инструменты (для некоторых пакетов npm)
RUN apt update && apt install -y python3 make g++

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json и ставим зависимости
COPY package*.json ./
RUN npm ci

# Копируем весь проект
COPY . .

# Генерируем Prisma Client для Linux прямо внутри контейнера
RUN npx prisma generate

# Команда запуска сервера
CMD ["node", "server.js"]
