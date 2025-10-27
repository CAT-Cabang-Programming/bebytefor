import prisma from "../db/index.js";

export const createComment = async (commentData) => {
  const comment = await prisma.comment.create({
    data: {
      content: commentData.content,
      userId: commentData.userId,
      threadId: commentData.threadId,
    },
  });

  return comment;
};

export const findCommentById = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return comment;
};

export const findCommentsByThreadId = async (threadId) => {
  const comments = await prisma.comment.findMany({
    where: {
      threadId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

export const findCommentsByUserId = async (userId) => {
  const comments = await prisma.comment.findMany({
    where: {
      userId,
    },
    include: {
      thread: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

export const updateComment = async (commentId, commentContent) => {
  const updated = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: commentContent,
    },
  });

  return updated;
};

export const deleteComment = async (commentId) => {
  const deleted = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return deleted;
};
