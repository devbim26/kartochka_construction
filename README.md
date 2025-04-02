# Documentation

## Dev

1. Run `npm i`
2. Set `ENV` args (see below)
3. Run `npm run dev`

## Build
1. Run `npm run format`
2. Fix warns and errors
3. Run `npm run build`
4. Run `npm run start`

## Development

Create `.env` and write:

```env
#https
REACT_APP_API_URL = https://192.168.10.23:5001/

#http
REACT_APP_API_URL = http://192.168.10.23:5000/

#for test host server
TEST_SERVER_PORT = 3000
```

## Deploy

### 1. HTTPS (Not working now)

File `Dockerfile` for `master` branch. App starts on https.

**Command:**

`docker build -t trans-acoustic-i-name:latest --build-arg REACT_APP_API_URL="api_url"`

### 2. HTTP

File `Dockerfile.dev` for `dev` branch. App starts on http.
Test commit

**Command:**

`docker build -f Dockerfile.dev -t trans-acoustic-i-name:latest --build-arg REACT_APP_API_URL=<url>`
