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
COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY server/ ./

# Copy client build
COPY --from=client-builder /app/client/build ./public

# Copy environment variables
COPY .env ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"] 