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
    alias: {
      '/assets': path.resolve(__dirname, 'node_modules/govuk-frontend/govuk/assets'),
    },
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
        test: /\.(png|jpg|gif|eot|ttf|woff|svg|woff2)$/,
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
    // Remember to also update run.sh, Dockerfile and config.js
    new webpack.EnvironmentPlugin({
      KEYCLOAK_AUTH_URL: 'https://sso-dev.notprod.homeoffice.gov.uk/auth',
      KEYCLOAK_CLIENT_ID: 'cerberus',
      KEYCLOAK_REALM: 'cop-dev',
      FORM_API_URL: undefined,
      REFDATA_API_URL: undefined,
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: process.env.PORT || 8080,
    proxy: {
      '/camunda': {
        target: process.env.CERBERUS_API_URL,
        pathRewrite: { '^/camunda': '' },
        secure: false,
        changeOrigin: true,
      },
    },
  },
};
