# Stage 1: Build client
FROM oven/bun:alpine AS builder
WORKDIR /app

COPY package.json .
RUN bun install

COPY . .
RUN bun run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 