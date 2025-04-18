FROM oven/bun:alpine AS builder
WORKDIR /app

COPY package.json .
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "dist/main.js"]