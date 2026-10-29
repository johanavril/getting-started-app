FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --omit=dev && npm rebuild sqlite3

FROM node:24-slim AS production
WORKDIR /app

ARG PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY src/ src/

RUN groupadd --system appgroup && useradd --system --gid appgroup appuser
RUN mkdir db
RUN chown -R appuser:appgroup db

USER appuser
EXPOSE ${PORT}

CMD ["node", "src/index.js"]
