import prisma from "../db/index.js";
import bcrypt from "bcrypt";

export const newUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: hashedPassword,
    },
  });
  return user;
};

export const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const findUserByName = async (userName) => {
  const user = await prisma.user.findUnique({
    where: {
      username: userName,
    },
  });

  return user;
};

export const updateUserProfile = async (id, userData) => {
  const updateData = { ...userData };

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(userData.password, salt);
  }

  const updated = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  });

  return updated;
};

export const deleteUserById = async (userId) => {
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return user;
};
