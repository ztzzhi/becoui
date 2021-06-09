// const path = require('path')

module.exports = {
  title: '小红书',
  entry: './src/index.ts',
  category: 'vue-app',
  errorTracker: {
    dsn: '', // https://xiaohongshu.quip.com/z9TfA1iwR46Y#GJIACA6rKbo
  },
  html:{
    favicon: 'https://fe-video-qc.xhscdn.com/picasso-editor/46ec4c533540c5274736dd7713877fd37e2c3830.ico',
  },
  experimental: {
    'svg-loader': true,
    onCreateConfig: ({ webpackConfig }) => {
      const conf = webpackConfig.getConfig()
      conf.module.rules.forEach(i => {
        if (i.test.test('ab.js')) {
          i.test = /\.jsx?$/
        }

        if (i.test.test('ab.tsx') || i.test.test('ab.ts')) {
          i.use.forEach(loader => {
            if (loader.loader === 'ts-loader') {
              loader.options = {
                ...loader.options,
                transpileOnly: true,
              }
            }
          })
        }
      })

      return conf
    },
  },
  resolve: {
    alias: {
      // 'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm-bundler.js'),
    },
  }
}
