FROM node:18-alpine AS runtime

# System settings
ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_CACHE=/tmp/npm-cache

WORKDIR /app/backend

# Install backend dependencies first (better layer caching)
COPY backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy backend source
COPY backend/ ./

EXPOSE 3000
CMD ["npm", "start"]


