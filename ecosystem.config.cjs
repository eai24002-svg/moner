module.exports = {
  apps: [
    {
      name: 'ruwaida-art',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
