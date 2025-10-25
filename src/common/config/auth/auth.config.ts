export const authConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET || "dev_access_secret",
    ttl: Number(process.env.JWT_ACCESS_TTL) || 900, // 15 min
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    ttl: Number(process.env.JWT_REFRESH_TTL) || 2592000, // 30 días
  },
  cookie: {
    name: "refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 1000 * 2592000, // 30 días en milisegundos
    },
  },
};
