FROM node:23.5-bookworm AS base
RUN apt update
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack prepare pnpm@`pnpm -v` --activate
RUN corepack use pnpm@`pnpm -v`
RUN pnpm add -g turbo

FROM base AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN turbo prune --scope=api --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json
RUN pnpm i --frozen-lockfile

FROM installer AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN pnpm turbo run build --filter=api
RUN pnpm turbo run db:push --filter=db

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=sourcer /app/ .
WORKDIR /app/apps/api/
CMD [ "pnpm", "start" ]
