const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nib = require('nib');
const path = require('path');
const babelOptions = require('./babelOptions.js');
const webpack = require('webpack');
const {EXAMPLES_PORT} = require('./Constants');

const baseOptions = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelOptions
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      }
    ]
  },
  stylus: {
    use: [nib()],
    import: ['~nib/lib/nib/index.styl']
  },
  postcss: [
    require('postcss-import')(),
    require('postcss-simple-vars')({ silent: true }),
    require('postcss-url')({
      url: 'inline'
    }),
    require('postcss-short-size')(),
    require('postcss-pxtorem')(),
    require('postcss-color-function')(),
    require('postcss-reporter'),
    require('postcss-browser-reporter')
  ]
};

function getWatchConfig() {
  return getConfig(false);
}

function getBuildConfig() {
  return getConfig(true);
}

function getConfig(build) {
  let options;
  if (build) {
    options = {
      entry: './lib/index.js',
      output: {filename: 'index.js'}
    };
  }
  else {
    options = {
      devtool: 'source-map',
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loader: 'react-hot'},
      ],
      entry: [
        './example/index.js',
        `webpack-dev-server/client?http://0.0.0.0:${EXAMPLES_PORT}`,
        'webpack/hot/only-dev-server'
      ],
      output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/assets/',
        filename: 'index.js'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ]
    };
  }

  return Object.assign({}, options, baseOptions);
}

module.exports = {getWatchConfig, getBuildConfig};