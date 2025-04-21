# Используем официальный образ Node.js для сборки
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci

# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL $REACT_APP_API_URL

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
