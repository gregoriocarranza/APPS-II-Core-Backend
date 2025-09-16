import dotenv from "dotenv";
dotenv.config();

const envPort: string = process.env.PORT || "3005";

if (isNaN(parseInt(envPort))) {
  throw new Error("The port must to be a number");
}

const PORT: number = parseInt(envPort);

(async () => {})().then(async () => {
  const { default: app } = await import("./app");
  app.listen(PORT, () => console.info(`Server up and running on port ${PORT}`));
});
