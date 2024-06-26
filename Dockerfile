FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY pnpm-lock.yaml .npmr[c] ./
RUN yarn global add pnpm@latest

RUN pnpm fetch

FROM node:18-alpine  AS builder
WORKDIR /app

COPY . .

RUN yarn global add pnpm@latest

RUN pnpm install

ARG NODE
ENV NODE=${NODE}

COPY ./.env.${NODE} /app/.env.production
ENV NODE_ENV=production

RUN pnpm build



FROM node:18-alpine  AS runner
WORKDIR /app

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Some things are not allowed (see https://github.com/vercel/next.js/issues/38119#issuecomment-1172099259)
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]