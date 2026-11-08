# Build del frontend
FROM node:22-alpine AS build

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile --filter @products/web...

COPY apps/web ./apps/web

RUN pnpm --filter @products/web run build

# Servidor estático con proxy hacia la API
FROM nginx:1.29-alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
