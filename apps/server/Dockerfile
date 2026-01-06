# Use Bun's official image
FROM oven/bun:1.3.4 as base
WORKDIR /app

# Install dependencies stage
FROM base AS install
# Copy package.json files and essential configs
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/native/package.json ./apps/native/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY turbo.json ./

# Copy Prisma schema and config so postinstall can generate client
COPY packages/db/prisma/schema ./packages/db/prisma/schema
COPY packages/db/prisma.config.ts ./packages/db/

# Install all dependencies (triggers postinstall for prisma generate)
RUN bun install --frozen-lockfile

# Copy source code stage
FROM install AS build
COPY . .

# Build the server
WORKDIR /app/apps/server
RUN bun run build

# Production stage
FROM base AS production
WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/packages/db/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/package.json ./package.json

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["bun", "run", "start"]
