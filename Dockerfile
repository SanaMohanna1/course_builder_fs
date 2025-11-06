FROM node:18-alpine

ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn

WORKDIR /app

# Copy package files from backend
COPY backend/package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline

# Copy backend source code
COPY backend/ ./

EXPOSE 3000

# Start the server
CMD ["npm", "start"]

