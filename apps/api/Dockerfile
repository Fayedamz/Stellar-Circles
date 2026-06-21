FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/stellar-client/package.json ./packages/stellar-client/

RUN npm install --workspace=apps/api --workspace=packages/shared --workspace=packages/stellar-client

# Copy source
COPY packages/shared ./packages/shared
COPY packages/stellar-client ./packages/stellar-client
COPY apps/api ./apps/api

# Build shared packages first, then api
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/stellar-client
RUN npm run build --workspace=apps/api

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=base /app/packages/stellar-client/dist ./packages/stellar-client/dist
COPY --from=base /app/packages/stellar-client/package.json ./packages/stellar-client/package.json
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/package.json ./apps/api/package.json

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
