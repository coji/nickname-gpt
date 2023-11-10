# base node image
FROM node:20-slim as base
ARG PNPM_VERSION=8.10.2

# Install openssl for Prisma
RUN apt-get update \
  && apt-get install --no-install-recommends -y openssl procps vim-tiny \
  && apt-get clean \
  && npm i -g pnpm@${PNPM_VERSION} \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install all node_modules, including dev dependencies
FROM base as deps

COPY .npmrc pnpm-lock.yaml ./
# ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN pnpm fetch

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /app/node_modules /app/node_modules
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Build the app
FROM base as build

COPY --from=deps /app/node_modules /app/node_modules
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate \
  && pnpm run build


# Run the app
FROM base

ENV NODE_ENV "production"

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/app /app/app

CMD ["pnpm", "start"]
