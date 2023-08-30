// schemas/todo.schema.js
import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://yungiDB:dbsrlgd@cluster0.bpcqzfd.mongodb.net/?retryWrites=true&w=majority",
      {
        dbName: "node_level1", // spa_mall 데이터베이스명을 사용합니다.
      }
    )
    .catch((err) => console.log(err))
    .then(() => console.log("몽고디비 연결 성공"));
};
// 몽고디비 연결 에러 이벤트 리스너
mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

export default connect;
