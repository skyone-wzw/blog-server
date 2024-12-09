FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN rm -rf .env* data
RUN npm ci
RUN npx prisma generate
RUN npm run patch-font
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY prisma prisma
COPY --from=builder /app/public public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static .next/static
COPY docker-bootstrap.sh .
ENV NEXT_TELEMETRY_DISABLED=1 NO_UPDATE_NOTIFIER=true
RUN npm install -g prisma

EXPOSE 3000
VOLUME ["/data"]
ENV PORT=3000 NODE_ENV=production HOSTNAME="0.0.0.0" DATA_DIR="/data" DATABASE_URL="file:/data/data.db"

CMD ["sh", "docker-bootstrap.sh"]