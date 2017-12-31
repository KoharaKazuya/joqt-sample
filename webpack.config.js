const path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve('dist'),
    filename: 'app.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },

  devtool: 'inline-source-map'
};
