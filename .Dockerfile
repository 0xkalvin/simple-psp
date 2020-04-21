FROM node:12.10-alpine

WORKDIR /app

COPY package.json /app/package.json

RUN npm i

COPY . .

EXPOSE 3000
