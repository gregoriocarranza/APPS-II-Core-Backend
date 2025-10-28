FROM node:22-alpine
WORKDIR /app

COPY dist ./dist

EXPOSE 3030
CMD ["node", "dist/server.js"]
