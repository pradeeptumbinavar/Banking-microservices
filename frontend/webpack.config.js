const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
      ),
      'process.env.REACT_APP_APP_NAME': JSON.stringify(
        process.env.REACT_APP_APP_NAME || 'Banking Portal'
      ),
      'process.env.REACT_APP_VERSION': JSON.stringify(
        process.env.REACT_APP_VERSION || '1.0.0'
      ),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    open: true,
    proxy: [
      {
        context: ['/auth', '/customers', '/accounts', '/credits', '/payments', '/notifications', '/admin'],
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

