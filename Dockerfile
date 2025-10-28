FROM node:22-alpine AS build
WORKDIR /app
 
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:22-alpine
WORKDIR /var/api

COPY package*.json ./
RUN npm ci --omit=dev --no-optional --prefer-offline --loglevel=warn --jobs=1

COPY --from=build /app/dist ./dist

EXPOSE 3030
CMD ["node", "dist/server.js"]
