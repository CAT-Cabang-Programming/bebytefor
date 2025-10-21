import express from "express";
import {
  getThreadById,
  getThreadBySlugId,
  editThread,
  deleteThread,
  createThread,
} from "./thread.service.js";
import { authenticate } from "../user/user.controller.js";

const router = express.Router();

router.get("/:slugId", async (req, res) => {
  try {
    const slugId = req.params.slugId;
    const result = await getThreadBySlugId(slugId);

    if (!result) {
      return res.status(404).send({ message: "Thread not found" });
    }

    res.send({
      data: result,
      message: "Thread retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const newThreadData = {
      ...req.body,
      userId: req.user.id,
    };

    const thread = await createThread(newThreadData);

    res.status(201).send({
      data: thread,
      message: "Thread created successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const threadId = req.params.id;
    const thread = await getThreadById(threadId);
    if (!thread) {
      return res.status(404).send({
        message: "Thread not found",
      });
    }

    if (thread.userId !== req.user.id) {
      return res.status(403).send({ message: "User unauthorized" });
    }

    await deleteThread(threadId);

    res.send({
      message: "Thread deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.patch("/update/:id", authenticate, async (req, res) => {
  try {
    const threadId = req.params.id;
    const threadData = req.body;

    const thread = await getThreadById(threadId);

    if (!thread) return res.status(404).send({ message: "Thread not found" });

    if (thread.userId !== req.user.id)
      return res.status(403).send({ message: "User unauthorized" });

    const updatedThread = await editThread(threadId, threadData);

    res.send({
      data: updatedThread,
      message: "Thread updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

export default router;
