FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

COPY ./credentials/astra-local.ds.key /etc/nginx/ssl/astra-local.ds.key
COPY ./credentials/astra-local.ds.crt /etc/nginx/ssl/astra-local.ds.crt

COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
