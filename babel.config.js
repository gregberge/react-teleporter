/* eslint-env node */
module.exports = (api) => {
  api.cache(true)

  if (process.env.NODE_ENV === 'test') {
    return {
      presets: [
        [
          '@babel/preset-env',
          { loose: true, modules: false, targets: { node: 'current' } },
        ],
        '@babel/preset-react',
      ],
      plugins: [['@babel/plugin-transform-modules-commonjs', { loose: true }]],
    }
  }

  return {
    presets: [
      ['@babel/preset-env', { loose: true, modules: false }],
      '@babel/preset-react',
    ],
  }
}
