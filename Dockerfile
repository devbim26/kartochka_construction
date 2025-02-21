# Используем официальный образ Node.js для сборки
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ./credentials/astra-local.ds.key /etc/nginx/ssl/astra-local.ds.key
COPY ./credentials/astra-local.ds.crt /etc/nginx/ssl/astra-local.ds.crt

RUN rm -rf /usr/share/nginx/html/* 

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 443

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
