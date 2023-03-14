# Install dependencies only when needed
FROM node:18-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat \
  && npm i -g pnpm \
  && pnpm config set store-dir /pnpm-store

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED 1
# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

RUN pnpm exec prisma generate && pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i -g pnpm \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

USER nextjs

CMD ["pnpm", "run", "start"]
