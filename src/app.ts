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
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
app.use(cookieParser());

if (process.env.ENVIRONMENT !== "production") {
  let generatedSchemas: Record<string, any> | undefined;
  try {
    const { getFromContainer, MetadataStorage } = require("class-validator");
    const {
      validationMetadatasToSchemas,
    } = require("class-validator-jsonschema");

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
            // Ignore errors
          }
        }
      }
    };
    requireDir(dtoDir);

    const metadatas = (getFromContainer(MetadataStorage) as any)
      .validationMetadatas;
    generatedSchemas = validationMetadatasToSchemas(metadatas, {
      refPointerPrefix: "#/components/schemas/",
    });
  } catch (err) {
    console.warn(
      "OpenAPI schema generation skipped (class-validator-jsonschema not available):",
      (err as Error).message || err
    );
  }

  const swaggerServers = [
    { url: "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com" },
  ];
  if ((process.env.ENVIRONMENT || "").toUpperCase() === "DEVELOPMENT") {
    swaggerServers.unshift({ url: "http://localhost:3030" });
  }
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: process.env.APP_NAME || "Core Backend API",
        version: "1.0.0",
      },
      servers: swaggerServers,
      components: {
        schemas: {
          ...(generatedSchemas || {}),
        },
      },
    },
    apis: [
      path.join(__dirname, "routes/**/*.ts"),
      path.join(__dirname, "controllers/**/*.ts"),
      path.join(__dirname, "docs/**/*.ts"),
      path.join(__dirname, "routes/**/*.js"),
      path.join(__dirname, "controllers/**/*.js"),
      path.join(__dirname, "docs/**/*.js"),
    ],
  };
  const swaggerSpec = swaggerJSDoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const asyncOutDir = path.join(__dirname, "../.docs/.build/async");
  app.use("/docs/async", express.static(asyncOutDir));
}

const allowed = getAllowedOrigins();
app.use(
  cors({
    origin: allowed === true ? true : allowed,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "refreshtoken"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", new IndexRouter().router);

app.use(errorMiddleware);

export default app;
