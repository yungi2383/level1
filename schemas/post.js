import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // 몽고 디비는 객체를 생성하면 자동으로 Object Id라는 값이, 난수가 생성되서 키로 들어감.
    // 이 Object Id를 몽구스에서는 _id로 쓸 수 있어요.
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Post", postSchema);
