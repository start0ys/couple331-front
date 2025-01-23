import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import webpackConfig from './webpack.config.js';
import router from './routes/index.js';
import config from './config/config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const compiler = webpack(webpackConfig);
const port = config.PORT;

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
  })
);
app.use(
  webpackHotMiddleware(compiler)
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use(cookieParser());

app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', router);


app.listen(port, () => {
  console.log(`개발 서버 실행 중: http://localhost:${port}`);
})