FROM node:20-alpine

WORKDIR /app

COPY . .

RUN corepack enable && pnpm install

RUN pnpm prisma:generate

RUN pnpm build

EXPOSE 6100

CMD [ "node", "dist/src/main.js" ]
