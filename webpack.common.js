import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMMON_JS_DIR = path.join(__dirname, 'public', 'js', 'common');
const PAGES_JS_DIR = path.join(__dirname, 'public', 'js', 'pages');

export default {
  entry: {
    common: path.join(COMMON_JS_DIR, 'common.js'),
    main: path.join(COMMON_JS_DIR, 'main.js'),
    auth: path.join(COMMON_JS_DIR, 'auth.js'),
    axios: path.join(COMMON_JS_DIR, 'axios.js'),
    index: path.join(PAGES_JS_DIR, 'index.js'),
    login: path.join(PAGES_JS_DIR, 'login.js'),
    signUp: path.join(PAGES_JS_DIR, 'signUp.js'),
    schedule: path.join(PAGES_JS_DIR, 'schedule.js'),
    boardList: path.join(PAGES_JS_DIR, 'boardList.js'),
    boardView: path.join(PAGES_JS_DIR, 'boardView.js'),
    boardEdit: path.join(PAGES_JS_DIR, 'boardEdit.js'),
    coupleEdit: path.join(PAGES_JS_DIR, 'coupleEdit.js'),
    coupleView: path.join(PAGES_JS_DIR, 'coupleView.js'),
    coupleWait: path.join(PAGES_JS_DIR, 'coupleWait.js'),
  },
  output: {
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      // CSS 파일 처리
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // 폰트, 이미지 파일 등 다른 자산들 처리
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
