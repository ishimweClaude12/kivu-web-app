# ---- Stage 1: build the React client ----
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---- Stage 2: runtime (Node server + static build) ----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/index.js ./index.js
COPY --from=client-build /client/dist ./public

# Run as the built-in non-root user.
USER node

EXPOSE 3000
CMD ["node", "index.js"]
