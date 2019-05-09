const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const dependencies = Object.keys(packageJson.dependencies);

class DependenciesAsExternalsPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('compile', params => {
      new ExternalModuleFactoryPlugin(
        compiler.options.output.libraryTarget,
        dependencies
      ).apply(params.normalModuleFactory);
    });
  }
}

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/lib",
    library: "ReportBuilder",
    libraryTarget: "commonjs2",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [
      new TsconfigPathsPlugin()
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          compiler: 'ttypescript'
        }
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre"
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: [/\.(gif|svg)$/],
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
  },
  plugins: [
    new DependenciesAsExternalsPlugin(),
    new MiniCssExtractPlugin(),
  ],
};