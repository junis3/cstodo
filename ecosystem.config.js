module.exports = {
  apps: [
    {
      name: 'cstodo',
      script: './src/index.ts',
      watch: true,
      ignore_watch: [
        'node_modules',
        '\\.git',
        '.\\.log',
        'cstodo\\.txt',
        'history\\.txt',
      ],
    },
  ],
};
