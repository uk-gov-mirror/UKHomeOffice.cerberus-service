const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      },
      {
        test: /\.(s*)css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|svg|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/govuk-frontend/govuk/assets', to: 'assets' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        KEYCLOAK_AUTH_URL: JSON.stringify(process.env.KEYCLOAK_AUTH_URL),
        KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.KEYCLOAK_CLIENT_ID),
        KEYCLOAK_REALM: JSON.stringify(process.env.KEYCLOAK_REALM),
      },
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};

