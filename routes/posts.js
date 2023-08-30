// /routes/todos.router.js

import express from "express";
import Post from "../schemas/post.js";

const router = express.Router();

/**  게시글 생성 **/
router.post("/posts", async (req, res) => {

  try {
    const { user, password, title, content } = req.body;
    const posts = await Post.create({ user, password, title, content });
    return res.status(200).json({
      message: "게시글을 생성하였습니다.",
      // FE 에서 post 하나로 가져올 수 있게 (안 묶어주면 user, title... 다 따로 불러와야함)
      post: {
        user: posts.user,
        title: posts.title,
        content: posts.content,
        postId: posts._id,
      },
    });
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/** 게시글 조회 **/
// => _id -> postId로 변경, content 삭제 해야함
router.get("/posts", async (req, res) => {
  // Post => 스키마 export 한 거
  const posts = await Post.find().exec();
  const result = [];
  for (let i = 0; i < posts.length; i++) {
    // posts[i]를 object로 바꿔줌 (delete 연산자는 객체에서만 쓸 수 있어서)
    const post = posts[i].toObject();
    // postId 생성 (객체에)
    post.postId = post._id;
    delete post.password;
    delete post._id;
    delete post.__v;

    result.push(post);
  }
  // data.map((_id) => post_id)
  return res.status(200).json({ result });
});

/** 게시글 상세 조회 **/
// 왜 안되는 지 모르겠당 req.params 저 부분이 잘못인 듯
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const postDetail = await Post.findOne({ _id: postId }).exec();
    return res.status(200).json({ postDetail });
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/** 게시글 수정 **/
router.patch("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, password } = req.body;
    const post = await Post.findById({ _id: postId }).exec();

    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    if (password !== post.password) {
      return res.json({ message: "비밀번호 오류" });
    }

    if (!title && !content) {
      // 404 Not Found 요청한 리소스를 찾을 수 없음, 400은 잘못된 요청
      return res.status(400).json({ message: "변경할 내용이 없습니다." });
    }

    if (title) {
      // updateOns {필터} {수정할 내용}
      await Post.updateOne({ _id: postId }, { title: title });
    }

    if (content) {
      // updateOns {필터} {수정할 내용}
      await Post.updateOne({ _id: postId }, { content: content });
    }

    const correction = await Post.findById({ _id: postId });
    res.status(200).json({
      postId: correction._id,
      title: correction.title,
      content: correction.content,
    });
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/** 게시글 삭제 **/
// postId는 어디서 설정하지...? 어디서 받아와서 지워야할 거 같은데 모르겠음
router.put("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    const post = await Post.findById({ _id: postId }).exec();
    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (password !== post.password) {
      return res.status(400).json({ message: "비밀번호 오류" });
    }
    await Post.findByIdAndDelete(postId);
    return res.status(200).end();
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 라우터 외부로 보내기
export default router;
