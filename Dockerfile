FROM node:22-alpine
ARG NPM_TOKEN
WORKDIR /var/api
COPY . .
RUN npm install
RUN npm run build && npm run build:asyncapi
EXPOSE 3030
CMD ["node", "dist/server.js"]