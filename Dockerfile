# Stage 1: Build React client
FROM node:18.19.1 as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
ENV CI=false
RUN npm run build

# Stage 2: Build and run server
FROM node:18.19.1-slim
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY server/ ./

# Copy client build
COPY --from=client-builder /app/client/build ./public

# Copy environment variables
COPY .env ./

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "start"] 