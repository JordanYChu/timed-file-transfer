FROM node:24-alpine AS build

# Create app directory
WORKDIR /app

# Copy entire source
COPY . .

WORKDIR /app/apps/file-api
RUN yarn install
RUN yarn build

WORKDIR /app/apps/postgres-manager
RUN npx prisma generate

# Build TypeScript (ensure tsconfig is set properly)
WORKDIR /app/apps/file-api

# Start using tsconfig-paths
CMD ["node", "dist/apps/file-api/src/index.js"]
