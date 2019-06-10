module.exports = api => {
  api.cache(true)

  const config = {
    presets: [
      ['@babel/preset-env', { loose: true, modules: false }],
      '@babel/preset-react',
    ],
  }

  if (process.env.NODE_ENV === 'test') {
    return {
      ...config,
      plugins: [['@babel/plugin-transform-modules-commonjs', { loose: true }]],
    }
  }

  return config
}
