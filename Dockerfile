FROM node:14 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test
RUN npm run build

FROM node:14-slim AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
