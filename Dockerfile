FROM node:22-alpine
WORKDIR /app
 
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --no-audit --progress=false --no-optional --prefer-offline --jobs=1 \
  && npm cache clean --force \
  && rm -rf /root/.npm /tmp/*

RUN rm -rf /root/.npm /tmp/*

COPY . .
RUN npm run build

EXPOSE 3030
CMD ["node", "dist/server.js"]
