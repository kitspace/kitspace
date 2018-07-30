const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  webpack(config) {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    }
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]',
        },
      },
    })

    return config
  },
})
