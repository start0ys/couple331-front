import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import webpack from "webpack";

export default merge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map", // 디버깅용
  output: {
    filename: '[name].js',
    publicPath: "/", // 개발 서버 경로
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR 플러그인
  ],
  // devServer: {
  //   contentBase: "./dist", // 정적 파일 제공 디렉토리
  //   hot: true, // HMR 활성화
  //   port: 8080,
  // },
});
