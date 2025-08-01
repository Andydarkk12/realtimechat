FROM node:20  AS builder

RUN apt update && apt install -y python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "./server.js"]
