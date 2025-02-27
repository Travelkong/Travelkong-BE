FROM node:23 AS base

RUN npm install -g pnpm

WORKDIR /src/app

COPY . ./

RUN pnpm install

CMD [ "pnpm", "dev" ]