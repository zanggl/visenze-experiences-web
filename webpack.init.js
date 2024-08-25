const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getS3Plugin = require('./webpack.s3');
const version = require('./init/version');

module.exports = () => {
  const mode = process.env.build || 'production';
  const filename = `${mode}.wigmix_widget_init.${version}.js`;
  const isPublish = process.env.publish === 'true';
  const configs = {
    entry: {
      main: path.join(__dirname, './init/index.js'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename,
      chunkFilename: '[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin(),
      ],
    },
    mode: 'production',
    plugins: [new CompressionPlugin()],
  };

  if (isPublish) {
    configs.plugins.push(getS3Plugin(mode));
  }

  return configs;
};
