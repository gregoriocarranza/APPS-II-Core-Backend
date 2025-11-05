require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "core-backend",
      script: "dist/server.js",
      cwd: "/home/ubuntu/APPS-II-Core-Backend",
      out_file: "/home/ubuntu/logs/core-backend.log",
      error_file: "/home/ubuntu/logs/core-backend.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      env: {
        ...process.env,
      },
    },
  ],
};
