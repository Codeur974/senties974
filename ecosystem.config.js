module.exports = {
  apps: [
    {
      name: "senties974-backend",
      script: "./backend/index.js",
      cwd: "./backend",
      env: {
        NODE_ENV: "development",
        PORT: 4001,
        MONGO_URI:
          process.env.MONGO_URI || "mongodb://localhost:27017/senties974",
        JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_file: "./logs/backend-combined.log",
      time: true,
    },
    {
      name: "senties974-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NEXT_PUBLIC_API_URL:
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_file: "./logs/frontend-combined.log",
      time: true,
    },
  ],
};
