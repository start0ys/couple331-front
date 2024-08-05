import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default {
    mode: 'development',
    entry: {
        main: './public/js/common/main.js',
        login: './public/js/pages/login.js',
        calendar: './public/js/pages/calendar.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader','css-loader'],
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
  };