import dotenv from "dotenv";
import express, { type Express } from "express";
// import logger from "morgan";
import cors from "cors";
import { IndexRouter } from "./routes/index";
import { errorMiddleware } from "./middlewares/error/error.middleware";
import { getAllowedOrigins } from "./common/config/origins/origins.config";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
// import yaml from "js-yaml";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
// const swaggerDocument = yaml.load(
//   fs.readFileSync(".docs/swagger-documentation.yaml", "utf8"),
// ) as object;

// app.use(
//   logger("tiny", {
//     skip: (req, _res) => {
//       return req.originalUrl.startsWith("/api/health");
//     },
//   }),
// );

if (process.env.ENVIRONMENT !== "production") {
  // Try to auto-generate OpenAPI component schemas from class-validator DTOs.
  // This is optional: if `class-validator-jsonschema` is not installed the app will continue
  // and you can still provide manual JSDoc component files.
  let generatedSchemas: Record<string, any> | undefined;
  try {
    // require here so this stays optional in environments where the package isn't installed
    const { getFromContainer, MetadataStorage } = require("class-validator");
    const { validationMetadatasToSchemas } = require("class-validator-jsonschema");

    // Require all DTO files so class-validator metadata is registered.
    const dtoDir = path.join(__dirname, "common", "dto");
    const requireDir = (p: string) => {
      if (!fs.existsSync(p)) return;
      for (const name of fs.readdirSync(p)) {
        const full = path.join(p, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) requireDir(full);
        else if (/\.(ts|js)$/.test(full)) {
          try {
            require(full);
          } catch (e) {
            // ignore individual require failures (e.g., TS files when running compiled JS)
          }
        }
      }
    };
    requireDir(dtoDir);

    const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
    generatedSchemas = validationMetadatasToSchemas(metadatas, { refPointerPrefix: "#/components/schemas/" });
  } catch (err) {
    // Not fatal — warn and continue
    // eslint-disable-next-line no-console
    console.warn("OpenAPI schema generation skipped (class-validator-jsonschema not available):", (err as Error).message || err);
  }
  // app.use("/docs", swaggerUi.serve);
  // app.get("/docs", swaggerUi.setup(swaggerDocument));
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: process.env.APP_NAME || "Core Backend API",
        version: "1.0.0",
      },
      servers: [
        { url: process.env.SWAGGER_SERVER_URL || "http://localhost:3030" },
      ],
      components: {
        schemas: {
          // Merge auto-generated schemas (if any). If generation fails, this will be empty.
          ...(generatedSchemas || {}),
        },
      },
    },
    apis: [
      path.join(__dirname, "routes/**/*.ts"),
      path.join(__dirname, "controllers/**/*.ts"),
      path.join(__dirname, "docs/**/*.ts"),
    ],
  };
  const swaggerSpec = swaggerJSDoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const asyncOutDir = path.join(__dirname, "../.docs/.build/async");
  app.use("/docs/async", express.static(asyncOutDir));
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
