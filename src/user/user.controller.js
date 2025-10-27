import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserById,
  getUserByName,
  updateUser,
  dropUser,
} from "./user.service.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).send({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid Token" });
  }
};

router.post("/register", async (req, res) => {
  try {
    const userData = req.body;

    const user = await createUser(userData);

    const { password, ...userWithoutPassword } = user;
    res.status(201).send({
      data: userWithoutPassword,
      message: "User registered",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getUserByName(username);
    if (!user) return res.status(404).send({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userWithoutPassword } = user;

    res.send({
      data: {
        ...userWithoutPassword,
        token,
      },
      message: "Login success",
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}` });
  }
});

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) res.status(404).send({ message: "User not found" });

    const { password, ...userWithoutPassword } = user;

    res.send({
      data: userWithoutPassword,
      message: "Profile retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error.message}`,
    });
  }
});

router.get("/search/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) return res.status(404).send({ message: "User not found" });

    const { password, ...userWithoutPassword } = user;
    res.send({
      data: userWithoutPassword,
      message: "User retrieved",
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}` });
  }
});

router.patch("/update/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    if (req.user.id !== userId)
      return res.status(403).send({ message: "User unauthorized" });

    const updatedUser = await updateUser(userId, userData);

    const { password, ...userWithoutPassword } = updatedUser;
    res.send({
      data: userWithoutPassword,
      message: "Update success",
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}` });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId) {
      return res.status(403).send({ message: `User unauthorized` });
    }

    await dropUser(userId);

    res.send({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}` });
  }
});

export default router;
