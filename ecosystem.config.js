module.exports = {
    apps: [{
      name: 'my-next-app',
      script: 'next start', // Directly use 'next start'
      cwd: '/path/to/my-next-app', 
      instances: 1, // Or 'max' if you want to utilize all cores
      interpreter: 'node', // Explicitly specify Node.js as the interpreter
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      watch: true, 
      ignore_watch: ['node_modules', '.next'], 
      log_date_format: 'YYYY-MM-DD HH:mm:ss', 
      // error_file: './logs/error.log',
      // out_file: './logs/out.log'
    }]
  };