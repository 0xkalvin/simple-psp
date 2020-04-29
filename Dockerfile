FROM node:12.10-alpine

WORKDIR /psp

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000
