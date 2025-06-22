module.exports = {
  apps: [
    {
      name: "front-tegcago",
      script: "next start -p 3003",
      cwd: "./",
      instances: "1", 
      interpreter: "node",
      watch: false,
      ignore_watch: ["node_modules", ".next"],
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
    },
  ],
};