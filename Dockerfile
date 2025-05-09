# Stage 1: Build React client
FROM node:18.19.1 as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./

# Set environment variables for client build
ENV REACT_APP_API_URL=https://catalog-app-b6cx9.ondigitalocean.app/api
ENV REACT_APP_ENV=production
ENV CI=false

# Build client
RUN echo "Building client with API URL: $REACT_APP_API_URL"
RUN npm run build
RUN ls -la build/

# Stage 2: Build and run server
FROM node:18.19.1-slim
WORKDIR /app/server

# Install curl and debugging tools
RUN apt-get update && apt-get install -y curl tree && rm -rf /var/lib/apt/lists/*

# Copy server files
COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY server/ ./

# Set up client files
RUN mkdir -p public
COPY --from=client-builder /app/client/build/ ./public/
RUN echo "Public directory structure:" && tree public/

# Set up environment
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["npm", "start"] 