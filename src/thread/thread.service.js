import {
  newThread,
  findThreadById,
  findThreadBySlugId,
  deleteThreadById,
  updateThread,
} from "./thread.repository.js";

export const createThread = async (threadData) => {
  const thread = await newThread(threadData);
  return thread;
};

export const getThreadById = async (threadId) => {
  const thread = await findThreadById(threadId);
  return thread;
};

export const getThreadBySlugId = async (slugId) => {
  const thread = await findThreadBySlugId(slugId);
  return thread;
};

export const deleteThread = async (id) => {
  const deleted = await deleteThreadById(id);

  return deleted;
};

export const editThread = async (id, threadData) => {
  const updated = await updateThread(id, threadData);
  return updated;
};
