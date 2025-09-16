import dotenv from "dotenv";
import express, { type Express } from "express";
import logger from "morgan";
import cors from "cors";
import { IndexRouter } from "./routes/index";
import { errorMiddleware } from "./middlewares/error/error.middleware";
import { getAllowedOrigins } from "./common/config/origins/origins.config";

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

dotenv.config();

const app: Express = express();

const swaggerDocument = yaml.load(
  fs.readFileSync('.docs/swagger-documentation.yaml', 'utf8')
) as object;

app.use(
  logger("tiny", {
    skip: (req, _res) => {
      return req.originalUrl.startsWith("/api/health");
    },
  }),
);

if (process.env.ENVIRONMENT !== 'production') {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(swaggerDocument));

  const asyncOutDir = path.join(__dirname, '../.docs/.build/async');
  app.use('/docs/async', express.static(asyncOutDir));
}



app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", new IndexRouter().router);

app.use(errorMiddleware);

export default app;
