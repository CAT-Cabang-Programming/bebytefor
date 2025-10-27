import prisma from "../db/index.js";
import slugify from "slugify";

export const newThread = async (threadData) => {
  const slug = slugify(threadData.title, { lower: true, strict: true });
  const thread = await prisma.thread.create({
    data: {
      title: threadData.title,
      content: threadData.content,
      slug,
      userId: threadData.userId,
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

  thread.url = `/${thread.slug}-${thread.id}`;
  return thread;
};

export const findThreadById = async (id) => {
  const thread = await prisma.thread.findUnique({
    where: {
      id,
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

  return thread;
};

export const findThreadBySlugId = async (slugId) => {
  const id = slugId.split("-").pop();

  const thread = await findThreadById(id);
  return thread;
};

export const deleteThreadById = async (id) => {
  const deleted = await prisma.thread.delete({
    where: {
      id,
    },
  });

  return deleted;
};

export const updateThread = async (id, threadData) => {
  const updateData = { ...threadData };

  if (threadData.title) {
    updateData.slug = slugify(threadData.title, { lower: true, strict: true });
  }

  const updated = await prisma.thread.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  updated.url = `/${updated.slug}-${updated.id}`;

  return updated;
};
