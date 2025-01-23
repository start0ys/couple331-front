import path from 'path'; // path 모듈 가져오기
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common.js';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

export default merge(commonConfig, {
  mode: 'production',
  devtool: 'source-map', // 소스맵 활성화
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve('dist'), // path 모듈 사용
    // publicPath: '/dist/', // 정적 파일 경로 설정,
    publicPath: '/', // 정적 파일 경로 설정,
  },
   plugins: [
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/dist/',
    })
  ],
});
