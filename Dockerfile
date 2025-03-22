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
RUN cp -r .next/standalone build
RUN cp -r .next/static build/.next/static
RUN cp -r public build/public

FROM base AS runner
WORKDIR /app
COPY prisma prisma
COPY --from=builder /app/build .
COPY docker-bootstrap.sh .
ENV NEXT_TELEMETRY_DISABLED=1 NO_UPDATE_NOTIFIER=1
RUN npm install -g prisma

EXPOSE 3000
VOLUME ["/data"]
ENV PORT=3000 NODE_ENV=production HOSTNAME="0.0.0.0" DATA_DIR="/data" DATABASE_URL="file:/data/data.db"

CMD ["sh", "docker-bootstrap.sh"]