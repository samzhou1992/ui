export {}
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.ts')
const PORT = parseInt(process.env.PORT, 10) || 8080
const PUBLIC = process.env.PUBLIC || undefined
const {BASE_PATH} = require('./src/utils/env')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    hot: false,
    watchContentBase: false,
    liveReload: false,
    // historyApiFallback: {
    //   index: `${BASE_PATH}/index.html`,
    // },
    compress: true,
    proxy: {
      '/influx': {
        target: 'http://localhost:8086',
        pathRewrite: { '^/influx': '' },
      },
      '/api/v2': 'http://localhost:8086',
      '/debug/flush': 'http://localhost:8086',
      '/oauth': 'http://localhost:8086',
      '/health': 'http://localhost:8086',
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    port: PORT,
    public: PUBLIC,
    publicPath: PUBLIC,
    sockPath: `${BASE_PATH}hmr`,
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, 'build'),
      manifest: require('./build/vendor-manifest.json'),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '0.0.0.0',
      analyzerPort: '9998',
      openAnalyzer: false,
    }),
  ],
})
