import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import router from "./routes/index.js";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = config.PORT;

// 정적 파일 제공 (운영 전용)
app.use(express.static(path.join(__dirname, "dist"), { index: false })); // dist 우선
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(cookieParser());

app.set("layout", "layouts/main");
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", router);

app.listen(port, () => {
  console.log(`운영 서버 실행 중: http://localhost:${port}`);
});
