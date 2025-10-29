export const getAllowedOrigins = (): string[] => {
  let origins: string = process.env.CORS_ALLOWED_ORIGINS || "localhost";
  if (!origin) {
    return ["*"]
  }
  origins = origins
    .split("\n")
    .join("")
    .split("\r")
    .join("")
    .split(" ")
    .join("");
  return origins.split(",");
};
