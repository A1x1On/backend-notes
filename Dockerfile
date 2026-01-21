FROM node:16-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./

RUN npm install

COPY backend/ .

# Устанавливаем глобальные зависимости для TypeScript, ts-node и dockerize
RUN npm install -g ts-node typescript
RUN apk add --no-cache curl && \
    curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar -xzC /usr/local/bin

EXPOSE 4005

CMD dockerize -wait tcp://db:5432 -timeout 30s npx ts-node --transpile-only src/index.ts
