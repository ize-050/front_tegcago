module.exports = {
  apps: [
    {
      name: "front-tegcago",
      script: "next start -p 3003", // Remove -p 3003 from here
      cwd: "./",  // Assuming ecosystem.config.js is in the project root
      instances: "1", 
      interpreter: "node",
      // port: 3003,
      // env: {
      //   NODE_ENV: "production",
      //   PORT: 3003, 
      // },
      watch: false, // Disable in production (optional)
      ignore_watch: ["node_modules", ".next"],
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
    },
  ],
};