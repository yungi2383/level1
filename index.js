// nodemon은 개발용인데, 개발할 때 쓰면 편하다!!
// yarn start 로 시작할 수 있고, ctrl + c 로 종료할 수 있다.
// start는 package.json에서 볼 수 있다.(script 부분)

const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
const {ObjectId} = require("mongodb");
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://yungiDB:dbsrlgd@cluster0.bpcqzfd.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connect() {
  try {
    await client.connect();
    db = client.db("node");
    console.log("Connected successfully to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connect();

app.get("/", (req, res) => {
    console.log(req.body)
  res.send("Hello World!");
});

// 게시글 조회
// 파람이가 : 뒤에 오는 거

// async, await 은 문법 -> 안쓰면 promise 객체가 나온다 (비동기 데이터 처리)
// async가 await을 만나면 await이 끝날 때까지 기다린다!!!! 
// DB 가져올 떄 까지 기다려 줄려고

//res.send 는 문자열 그대로
//res.json 은 데이터 형태로 (보통은 json 사용) -> response가 객체 형태일 때, JSON으로!!

// 특정 id 게시물 조회
app.get("/posts/:postId", async(req, res) => {
    // projection로 id 키값 제외할 수 있다!!!!!
    let read = await db.collection("post").findOne({_id: new ObjectId(req.params.postId)},{ projection: { _id: 0 } }
    )
    // array[i] 느낌으로 .키값 하기
    console.log(read)
    console.log(req.body.내용)
    console.log(req.params.postId)
  res.json(read);
});


// 전체 게시물 조회
app.get("/posts", async(req, res) => {
    let readAll = await db.collection("post").find({}).toArray()
    console.log(readAll)
    console.log(req.body.내용)
    console.log(req.params.postId)
  res.json(readAll);
});



// 게시글 생성
app.post("/posts",(req, res) => {
    let post = req.body
    db.collection("post").insertOne(post)
    console.log(post)
    res.send("게시글을 생성하였습니다.")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 게시글 수정

// postId 변수 이름은 어디서 또 쓰이는 거지?
app.put("/posts/:postId", async(req, res) => {
    // projection로 id 키값 제외할 수 있다!!!!!
    // Request에서 Path Params 데이터의 name Key를 가진 Value를 name 변수에 할당한다.(?)
    // => 제목, 내용 Key를 가진 Value를 
    let {제목, 내용} = req.body
    let read = await db.collection("post").updateOne({_id: new ObjectId(req.params.postId)},{ $set: {제목: 제목, 내용: 내용 } }

    )
    // array[i] 느낌으로 .키값 하기
    
    
    console.log(read)
    console.log(req.body.내용)
    console.log(req.params.postId)
  res.json(read);
});

// 게시글 삭제 -> req.body 받으려고 put/post 쓸 때도 있음
app.delete("/posts/:postId", async(req, res) => {
    // projection로 id 키값 제외할 수 있다!!!!!
    let read = await db.collection("post").deleteOne({_id: new ObjectId(req.params.postId)}
    )
    // array[i] 느낌으로 .키값 하기
    console.log(read)
    console.log(req.body.내용)
    console.log(req.params.postId)
  res.json(read);
});


