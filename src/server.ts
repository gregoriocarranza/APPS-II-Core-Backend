import dotenv from "dotenv";
import KnexManager from "./database/KnexConnection";
dotenv.config();

const envPort: string = process.env.PORT || "3005";

if (isNaN(parseInt(envPort))) {
  throw new Error("The port must to be a number");
}

const PORT: number = parseInt(envPort);

(async () => {})().then(async () => {
  try {
    await KnexManager.connect();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // Evita levantar el servidor sin DB
  }

  const { default: app } = await import("./app");
  app.listen(PORT, () => console.info(`Server up and running on port ${PORT}`));
});
