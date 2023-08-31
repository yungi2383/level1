import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://yungiDB:dbsrlgd@cluster0.bpcqzfd.mongodb.net/?retryWrites=true&w=majority",
      {
        dbName: "node_level1",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
      }
    )
    .then(() => {
      console.log("몽고디비 연결 성공");
    })
    .catch((err) => {
      console.error("몽고디비 연결 실패", err);
    });
};

// 몽고디비 연결 에러 이벤트 리스너
mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

export default connect;

조윤주(N반);
Available;

66;
