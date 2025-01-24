ARG REACT_APP_API_URL 
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY certificate.crt /etc/nginx/ssl/certificate.crt 
COPY certificate.key /etc/nginx/ssl/certificate.key

RUN rm -rf /usr/share/nginx/html/* 
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
