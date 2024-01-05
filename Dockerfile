FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run patch-font
RUN npm run build

EXPOSE 3000
VOLUME ["/data"]
ENV PORT=3000 NODE_ENV=production HOSTNAME="0.0.0.0" DATA_DIR="/data" DATABASE_URL="file:/data/data.db"

CMD ["sh", "docker-bootstrap.sh"]