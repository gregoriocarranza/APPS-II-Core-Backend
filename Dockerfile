FROM node:22-alpine
WORKDIR /var/api

# Copiar manifests
COPY package*.json ./

# Instala SOLO dependencies (sin dev ni asyncapi)
RUN npm ci --omit=dev --no-optional --prefer-offline --loglevel=warn --jobs=2

# Copiar código compilado (dist) al contenedor
COPY dist ./dist

EXPOSE 3030
CMD ["node", "dist/server.js"]
