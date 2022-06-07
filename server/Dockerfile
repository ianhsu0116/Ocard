# syntax=docker/dockerfile:1
FROM node:14

RUN mkdir /server
WORKDIR /server

# RUN npm install
COPY package*.json ./
RUN npm install && mv node_modules /node_modules
# RUN npm install apidoc -g

COPY . .

EXPOSE 80

CMD node index.js