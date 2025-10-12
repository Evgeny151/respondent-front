# Шаг 1: сборка Vite фронтенда
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем весь проект
COPY . .

# Собираем проект
RUN npm run build

# Шаг 2: nginx для отдачи фронтенда
FROM nginx:alpine

# Копируем из Vite dist вместо build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]