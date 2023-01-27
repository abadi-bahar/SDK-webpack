const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const nodeExternals = require("webpack-node-externals")


module.exports = {
entry: {
  main: path.resolve(__dirname, './src/index.js'),
},
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'index.js',
  clean: true,
  libraryTarget: 'umd',
  umdNamedDefine: true
},
module : {
 rules: [
     {
       test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
       type: 'asset/resource',
     },
     {
       test: /\.css$/,
       use: ["style-loader", "css-loader"]
     },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
  ]
  },
  plugins: [
        new HtmlWebpackPlugin({
             title: "Webpack Output",
           }),
  ],

};