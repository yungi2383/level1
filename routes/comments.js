// /routes/todos.router.js

import express from "express";
import connect from "../schemas/index.js";
import Comment from "../schemas/comment.js";
import Post from "../schemas/post.js";
import comment from "../schemas/comment.js";

const router = express.Router();

/**  댓글 생성 **/
router.post("/comments/:postId", async (req, res) => {
  // TODO: 포스트가 존재하는지 확인한다.
  try {
    const { postId } = req.params;
    const { user, content, password } = req.body;
    const post = await Post.findById({ _id: postId });

    // post 없으면 404 에러
    if (!post) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }

    // 댓글 content 확인

    // 댓글 생성 및 반환
    await Comment.create({ user, content, postId: post._id, password });
    // 댓글 전체리스트 조회 후 리스트를 반환 await Comment.find({필터링}))
    const comments = await Comment.find({ postId: postId });
    const result = [];
    for (let i = 0; i < comment.length; i++) {
      // posts[i]를 object로 바꿔줌 (delete 연산자는 객체에서만 쓸 수 있어서)
      const comment = comments[i].toObject();
      delete comment.password;
      delete comment.updatedAt;
      delete comment.postId;
      delete comment.__v;

      result.push(comment);
    }
    return res.status(200).json({ message: "댓글을 생성하였습니다.", result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/**  댓글 조회 **/
// Todo :

router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  // .sort "createdAt" 날짜 순 정렬
  // -1은 내림차순, 그이외는 오름차순
  const comments = await Comment.find({ postId: postId }).sort({
    createdAt: -1,
  });
  const result = [];
  for (let i = 0; i < comment.length; i++) {
    // posts[i]를 object로 바꿔줌 (delete 연산자는 객체에서만 쓸 수 있어서)
    const comment = comments[i].toObject();
    delete comment.password;
    delete comment.updatedAt;
    delete comment.postId;
    delete comment.__v;

    result.push(comment);
  }
  return res.status(200).json({ result });
});

/**  댓글 수정 **/
router.patch("/comments/:commentsId", async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { content, password } = req.body;
    const comment = await Comment.findById({ _id: commentsId }).exec();

    if (!comment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    if (password !== comment.password) {
      return res.json({ message: "비밀번호 오류" });
    }

    if (!content) {
      // 404 Not Found 요청한 리소스를 찾을 수 없음, 400은 잘못된 요청
      return res.status(400).json({ message: "변경할 내용이 없습니다." });
    }
    // updateOns {필터} {수정할 내용}
    // id는 왜 다시 수정했더라... 수정 안하면 안되나
    await Comment.updateOne({ _id: commentsId }, { content: content });

    // commentsId = 파람이, 수정된 아이디 찾아서 correction에 담았당
    const correction = await Comment.findById({ _id: commentsId });
    /* const newComment = correction.toObject()
    newComment.comments
    delete newComment.password;
    delete newComment.postId;
    delete newComment._id */
    // correction 배열에서  id, content 값 찾아서 필요한 것만 골라서 리턴해줌
    // 원래는 보통 json({correction}) 이렇게 담았는데 이건 너무 많이 나옴
    // 다른 데 서는 객체로 바꿔서(toObject) delete 하기도 함
    // 차이점이 뭔지는 나중에 공부해보자 지금은 힘들다ㅠㅠ /* */ 안에 코드 참고
    return res.status(200).json({
      commentsId: correction._id,
      content: correction.content,
    });
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/**  댓글 삭제 **/
router.put("/comments/:commentsId", async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { password } = req.body;
    const comment = await Comment.findById({ _id: commentsId });
    if (!comment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (password !== comment.password) {
      return res.status(400).json({ message: "비밀번호 오류" });
    }
    await Comment.findByIdAndDelete(commentsId);
    return res.status(200).end();
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 라우터 외부로 보내기
export default router;
