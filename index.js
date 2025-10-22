import express from "express";
import dotenv from "dotenv";
import threadController from "./src/thread/thread.controller.js";
import userController from "./src/user/user.controller.js";
import commentController from "./src/comment/comment.controller.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/threads", threadController);
app.use("/users", userController);
app.use("/comments", commentController);

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
