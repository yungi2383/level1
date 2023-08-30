// /app.js
import express from "express";
import connect from "./schemas/index.js";
import { postsRouter, commentsRouter } from "./routes/index.js";
// import commentsRouter from "./routes/comments.js";
// import postsRouter from "./routes/posts.js";

const app = express();
const PORT = 3000;
connect();

// JSON 미들웨어 사용 설정
app.use(express.json());
// Post(); // 얘는 뭐 하는 거지...

app.get("/", (req, res) => {
  res.send("안뇽안뇽헤헷");
});

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
app.use(express.static("./assets"));

const router = express.Router();

app.get("/", (req, res) => {
  return res.json({ message: "Hi!" }); // 이 부분 뭐 써야하는 지 잘 모르겠음ㅠㅠ
});

// /api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use("/api", postsRouter);
app.use("/api", commentsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
