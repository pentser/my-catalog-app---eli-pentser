# Stage 1: Build React client
FROM node:18.19.1 as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build and run server
FROM node:18.19.1-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
COPY --from=client-builder /app/client/build ./public

# Copy environment variables
COPY .env ./

EXPOSE 5000
CMD ["npm", "start"] 