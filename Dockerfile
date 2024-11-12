# Stage 1
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci

#Stage 2
ARG REACT_APP_API_URL 
ARG SERVER_NAME 
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env
RUN echo "SERVER_NAME=$SERVER_NAME" >> .env

# Stage 3
RUN npm run build

# Stage 4
FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

ARG SSL_CERTIFICATE 
ARG SSL_CERTIFICATE_KEY
RUN cp $SSL_CERTIFICATE /etc/nginx/ssl/certificate.crt 
RUN cp $SSL_CERTIFICATE_KEY /etc/nginx/ssl/certificate.key

RUN rm -rf /usr/share/nginx/html/* 
COPY --from=build /app/build /usr/share/nginx/html

RUN envsubst < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
