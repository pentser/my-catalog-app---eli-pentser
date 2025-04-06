# Stage 1: Build React client
FROM node:18.19.1 as client-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
WORKDIR /app/client
RUN npm install --legacy-peer-deps
ENV CI=false
RUN npm run build
RUN ls -la build/

# Stage 2: Build and run server
FROM node:18.19.1-slim
WORKDIR /app/server

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy server files
COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY server/ ./

# Create public directory and ensure it exists
RUN mkdir -p public && ls -la

# Copy client build files
COPY --from=client-builder /app/client/build ./public/
RUN echo "Contents of public directory:" && ls -la public/

# Copy environment variables if they exist
COPY .env* ./

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["npm", "start"] 