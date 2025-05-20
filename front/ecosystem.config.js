module.exports = {
  apps: [
    {
      name: 'foodly-frontend',
      script: 'pnpm',
      args: 'start',
      restart_delay: 4000,
      max_restarts: 10,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      ignore_watch: ['node_modules'],
    },
  ],
};
