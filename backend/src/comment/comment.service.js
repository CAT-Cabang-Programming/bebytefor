import {
  createComment,
  findCommentById,
  findCommentsByUserId,
  findCommentsByThreadId,
  updateComment,
  deleteComment,
} from "./comment.repository.js";

export const addComment = async (commentData) => {
  const newComment = await createComment(commentData);
  return newComment;
};

export const getCommentById = async (commentId) => {
  const comment = await findCommentById(commentId);
  return comment;
};

export const getUserComments = async (userId) => {
  const comments = await findCommentsByUserId(userId);
  return comments;
};

export const getThreadComments = async (threadId) => {
  const comments = await findCommentsByThreadId(threadId);
  return comments;
};

export const editComment = async (commentId, commentContent) => {
  const edited = await updateComment(commentId, commentContent);
  return edited;
};

export const dropComment = async (commentId) => {
  const deleted = await deleteComment(commentId);
  return deleted;
};
