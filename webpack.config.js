const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin');
const path = require('path');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const dependencies = Object.keys(packageJson.dependencies);

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
    alias: {
      src: path.resolve('src'),
      images: path.resolve('src/assets/images'),
    },
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: [/\.gif$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.compile.tap('compile', params => {
          new ExternalModuleFactoryPlugin(
            compiler.options.output.libraryTarget,
            dependencies
          ).apply(params.normalModuleFactory);
        });
      }
    },
  ],
};