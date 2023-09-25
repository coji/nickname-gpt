# base node image
FROM node:20-slim as base

# Install openssl for Prisma
RUN apt-get update \
  && apt-get install --no-install-recommends -y openssl procps vim-tiny sqlite3 \
  && apt-get clean \
  && npm i -g bun \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup production node_modules
FROM base as production-deps

COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile

# Build the app
FROM base as build

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run prisma generate \
  && bun run build


# Run the app
FROM base

RUN printf '#!/bin/sh\nset -x\nsqlite3 file:/upflow/data/data.db\n' > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

COPY --from=production-deps /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/tsconfig.json /app/tsconfig.json

CMD ["bun", "start"]
