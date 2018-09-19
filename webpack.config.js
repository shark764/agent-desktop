const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const config = {
    entry: {
      app: './app/app.js',
    },
    output: {
      path: path.resolve(__dirname, 'build'),
    },
    externals: {
      CxEngage: 'CxEngage',
    },
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules')],
      alias: {
        assets: path.resolve(__dirname, 'app', 'assets'),
        containers: path.resolve(__dirname, 'app', 'containers'),
        components: path.resolve(__dirname, 'app', 'components'),
        icons: path.resolve(__dirname, 'app', 'icons'),
        models: path.resolve(__dirname, 'app', 'models'),
        translations: path.resolve(__dirname, 'app', 'translations'),
        utils: path.resolve(__dirname, 'app', 'utils'),
        store: path.resolve(__dirname, 'app', 'store'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './app/index.html',
      }),
      // new BundleAnalyzerPlugin({
      //     analyzerMode: 'static'
      // }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            query: { compact: false },
          },
          exclude: /node_modules(?!(\/|\\)cx-ui-components)/,
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader!postcss-loader',
        },
        {
          test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader',
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.[ot]tf$/,
          loader: 'url-loader',
          query: {
            limit: 50000,
            mimetype: 'application/opentype',
            name: './fonts/[hash].[ext]',
          },
        },
        {
          test: /\.(mp3)$/,
          loader: 'file-loader',
        },
      ],
    },
  };
  if (argv === undefined || argv.mode === 'development') {
    config.output.filename = '[name]-[hash].bundle.js';
    config.output.publicPath = '/';
    config.devServer = {
      contentBase: './build',
      hot: true,
      disableHostCheck: true,
    };
    config.devtool = 'inline-module-source-map';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else if (argv.mode === 'production') {
    config.output.filename = '[name]-[chunkhash:6].bundle.js';
    config.output.publicPath = './';
    config.output.sourceMapFilename = '[name]-[chunkhash:6].js.map';
    config.devtool = 'source-map';
  }
  return config;
};
