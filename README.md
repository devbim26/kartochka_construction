# Documentation

## Dev

1. Run `npm i`
2. Set `ENV` args (see below)
3. Run `npm start`

## Development

Create `.env` and write:

```env
#https
REACT_APP_API_URL = https://192.168.10.23:5001/swagger/index.html

#http
REACT_APP_API_URL = http://192.168.10.23:5000/swagger/index.html
```

## Deploy

**Production**

File `Dockerfile` for `master` branch. App starts on https.

**Command:**

`docker build --build-arg REACT_APP_API_URL=<url> --build-arg SERVER_NAME=<domain or ip> --build-arg SSL_CERTIFICATE=<path to crt> --build-arg SSL_CERTIFICATE_KEY=<path to key> -t trans-acoustic-i-name`

**Development**

File `Dockerfile.dev` for `dev` branch. App starts on http. 

**Command:**

`docker build --build-arg REACT_APP_API_URL=<url>`