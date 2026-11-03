FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --omit=dev && npm rebuild sqlite3 --foreground-scripts --loglevel verbose

FROM node:24-slim AS production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY src/ src/

RUN groupadd --system appgroup && useradd --system --gid appgroup appuser
RUN mkdir db
RUN chown -R appuser:appgroup db

USER appuser
EXPOSE 3000

CMD ["node", "src/index.js"]
