FROM node:22-alpine
WORKDIR /app
 
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3030
CMD ["node", "dist/server.js"]
