import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from 'webpack';

// 개발 환경에서 사용할 웹팩 핫 모듈 리플레이스먼트 클라이언트
const HMR_CLIENT = 'webpack-hot-middleware/client?reload=true';

// 자바스크립트 소스 디렉토리
const COMMON_JS_DIR = './public/js/common';
const PAGES_JS_DIR = './public/js/pages';

export default {
    mode: 'development',
    //mode: 'production', // 운영 환경 모드
    entry: {
        // main: './public/js/common/main.js', // 운영 환경 모드
        // login: './public/js/pages/login.js', // 운영 환경 모드
        // calendar: './public/js/pages/calendar.js' // 운영 환경 모드
        common: [HMR_CLIENT, `${COMMON_JS_DIR}/common.js`],
        main: [HMR_CLIENT, `${COMMON_JS_DIR}/main.js`],
        auth: [HMR_CLIENT, `${COMMON_JS_DIR}/auth.js`],
        login: [HMR_CLIENT, `${PAGES_JS_DIR}/login.js`],
        signUp: [HMR_CLIENT, `${PAGES_JS_DIR}/signUp.js`],
        calendar: [HMR_CLIENT, `${PAGES_JS_DIR}/calendar.js`],
        board: [HMR_CLIENT, `${PAGES_JS_DIR}/board.js`]
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        publicPath: '/',  // 개발 서버에서 제공할 경로 설정
        //publicPath: '/dist/' // 운영 환경에서 사용할 경로
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
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin()  // HMR 플러그인 추가 개발에서 사용
    ],
    devtool: 'inline-source-map'  // 디버깅을 위한 소스 맵 설정
    // devtool: 'source-map' 보안과 파일 크기때문에  운영환경에서는 source-map 
    
  };