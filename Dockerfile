FROM node:22-alpine
WORKDIR /var/api
 
COPY package*.json ./

RUN npm ci --omit=dev --no-optional --prefer-offline --loglevel=warn --jobs=2
COPY . .

RUN npm run build

EXPOSE 3030
CMD ["node", "dist/server.js"]
