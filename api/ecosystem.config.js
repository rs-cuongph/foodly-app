module.exports = {
  apps: [
    {
      name: 'tracking-payment-service',
      script: 'dist/main.js',
      // exec_mode: 'cluster', // Use cluster mode for better performance, not show log
      restart_delay: 4000,
      max_restarts: 10,
      watch: ['dist'], // Restart on changes in the dist folder
      ignore_watch: ['node_modules'], // Ignore node_modules folder
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
