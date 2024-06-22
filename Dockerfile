# Stage 1: Build Hello World UI
FROM node:21 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test
ENV NODE_ENV=${ENV}
ENV API_URL=${API_URL}
EXPOSE 3000
CMD ["node", "server.js"]