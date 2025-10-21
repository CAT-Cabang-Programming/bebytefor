import express from "express";
import {
  addComment,
  getCommentById,
  getThreadComments,
  getUserComments,
  editComment,
  dropComment,
} from "./comment.service.js";
import { authenticate } from "../user/user.controller.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const commentData = {
      content: req.body.content,
      userId: req.user.id,
      threadId: req.body.threadId,
    };

    const comment = await addComment(commentData);

    res.status(201).send({
      data: comment,
      message: "Comment created",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await getCommentById(commentId);

    if (!comment) return res.status(404).send({ message: "Comment not found" });

    res.send({
      data: comment,
      message: "Comment retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  try {
    const threadId = req.params.threadId;
    const comments = await getThreadComments(threadId);

    res.send({
      data: comments,
      message: "Comments retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const comments = await getUserComments(userId);

    res.send({
      data: comments,
      message: "Comments retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.patch("/update/:id", authenticate, async (req, res) => {
  try {
    const commentId = req.params.id;
    const content = req.body.content;

    const commentExists = await getCommentById(commentId);
    if (!commentExists)
      return res.status(404).send({ message: "Comment not found" });

    if (commentExists.user.id !== req.user.id)
      return res.status(403).send({ message: "User unauthorized" });

    const comment = await editComment(commentId, content);

    res.send({
      data: comment,
      message: "Comment updated",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const commentId = req.params.id;

    const commentExists = await getCommentById(commentId);
    if (!commentExists)
      return res.status(404).send({ message: "Comment not found" });

    if (commentExists.user.id !== req.user.id)
      return res.status(403).send({ message: "User unauthorized" });

    await dropComment(commentId);

    res.send({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

export default router;
