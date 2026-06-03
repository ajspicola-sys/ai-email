# --- STAGE 1: Build the React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependencies configuration
COPY frontend/package*.json ./
RUN npm install

# Copy source and build static assets
COPY frontend/ ./
RUN npm run build

# --- STAGE 2: Run the Express Server ---
FROM node:20-alpine AS server-runtime
WORKDIR /app/backend

# Install production dependencies only
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend application source
COPY backend/ ./

# Copy built frontend assets from Stage 1 into the backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./public

# Setup default environment configurations
ENV PORT=5000
ENV NODE_ENV=production
ENV DATABASE_FILE=/data/database.sqlite

# Create directory for SQLite storage (to support persistent volume mounts)
RUN mkdir -p /data

EXPOSE 5000

# Run Express server
CMD ["node", "server.js"]
