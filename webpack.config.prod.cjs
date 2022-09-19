const path = require('path');

module.exports = {
  entry: {
    'araisdk': './sdk/sdk.js'
  },
  mode: 'production',
  output: {
    filename: '[name].prod.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            name: '[name].prod.js'
          },
        },
      },
      {
	test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
	  'sass-loader'
        ]
      },
      {
	test: /\.html$/,
        use: 'html-loader',
      }
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false
    }
  }
};
