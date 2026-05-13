# syntax=docker/dockerfile:1.7

# Stage 1: production-only deps for the runtime stage.
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile=false --ignore-scripts

# Stage 2: full deps + TypeScript build.
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile=false --ignore-scripts
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN pnpm build

# Stage 3: Distroless runtime, non-root, no shell.
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps   /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY src/db/migrations ./src/db/migrations
EXPOSE 3333
USER nonroot
CMD ["dist/server.js"]
