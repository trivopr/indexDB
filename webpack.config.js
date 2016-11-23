var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve('js'),

  entry: ['./lib', './app'],

  output: {
    path: path.resolve('build/'),
    publicPath: '/public/assets/',
    filename: 'main-bundle.js'
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })

  ],

  devServer: {
    contentBase: 'public'
  },

  module: {
    loaders: [

      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' },
      { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'url?limit=100000&name=[name].[ext]'},

      {
        test: /\.(es6|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },

      {
        test: /\.(js|es6)$/,
        include:  __dirname + '/app/js',
        loader: 'babel?presets[]=es2015'
      }
    ]
  },

  watch: true,

  resolve: {
    extensions: ['', '.js', '.es6']
  },
};
