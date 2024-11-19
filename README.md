# Documentation

## Dev

1. Run `npm i`
2. Set `ENV` args (see below)
3. Run `npm start`

## Development

Create `.env` and write:

```env
#https
REACT_APP_API_URL = https://192.168.10.23:5001/

#http
REACT_APP_API_URL = http://192.168.10.23:5000/
```

## Deploy

### 1. Production

File `Dockerfile` for `master` branch. App starts on https.

**Command:**

`docker build -t trans-acoustic-i-name:latest --build-arg REACT_APP_API_URL="api_url" --build-arg SERVER_NAME="ip_or_domain" .`

### 2. Development

File `Dockerfile.dev` for `dev` branch. App starts on http.

**Command:**

`docker build -f Dockerfile.dev --build-arg REACT_APP_API_URL=<url>`
