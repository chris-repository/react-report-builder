const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');

module.exports = {
  devtool: 'eval',
  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    host: 'localhost'
  },
  entry: {
    lib: path.join(dirApp, '../../lib/index.js'),
    app: path.join(dirApp, 'index.jsx'),
  },
  resolve: {
    modules: [
      dirNode,
      dirApp
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: [/\.svg$/],
        loader: 'url-loader',
        options: {
          name: 'static/images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          name: 'static/fonts/[name].[hash:8].[ext]',
        },
      }
    ]
  }
};
