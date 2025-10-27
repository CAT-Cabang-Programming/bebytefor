import {
  newUser,
  findUserById,
  findUserByName,
  updateUserProfile,
  deleteUserById,
} from "./user.repository.js";

export const createUser = async (userData) => {
  const created = await newUser(userData);

  return created;
};

export const getUserById = async (id) => {
  const user = await findUserById(id);

  return user;
};

export const getUserByName = async (username) => {
  const user = await findUserByName(username);

  return user;
};

export const updateUser = async (id, userData) => {
  const updated = await updateUserProfile(id, userData);

  return updated;
};

export const dropUser = async (id) => {
  const deleted = await deleteUserById(id);

  return deleted;
};
