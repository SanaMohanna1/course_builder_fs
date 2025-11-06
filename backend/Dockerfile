FROM node:18-alpine

ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline

# Copy app source
COPY . ./

EXPOSE 3000
CMD ["npm", "start"]


