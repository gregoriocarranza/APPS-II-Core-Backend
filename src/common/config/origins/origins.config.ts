export const getAllowedOrigins = (): string[] | true => {
  let origins: string = process.env.CORS_ALLOWED_ORIGINS || "localhost";
  if (origins === "localhost" || origins === "") {
    console.info("No origin in configuration");
    return true;
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
