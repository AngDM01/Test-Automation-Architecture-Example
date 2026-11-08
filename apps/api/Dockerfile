# Servidor de la API
FROM node:22-alpine

RUN apk add --no-cache openssl
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --filter @products/api...

COPY apps/api ./apps/api

RUN pnpm --filter @products/api run prisma:generate
RUN pnpm --filter @products/api run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "pnpm --filter @products/api run prisma:deploy && node apps/api/dist/server.js"]
