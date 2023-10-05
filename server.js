import express from "express";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
import mongoose from "mongoose";
import User from "./Models/user.js";
import Post from "./Models/post.js";

dotEnv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({ message: "Welocome on Mployee.me" });
});

// 1. User Sign-Up API
app.post("/api/signup", (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({
      name: name,
      email: email,
    });
    user.save();
    res.status(200).send({
      success: true,
      message: "Successful user sign-up",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sign-up",
      error,
    });
  }
});

// 2. Create Post API
app.post("/api/posts", (req, res) => {
  const { userId, content } = req.body;
  try {
    const newPost = new Post({
      userId,
      content,
    });
    newPost.save();
    res.status(200).send({
      success: true,
      message: "Successfully created",
      newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

// 3 Delete Post API
app.delete("/api/deletepost/:postId", async (req, res) => {
  const  {postId} = req.params;
  try {

   const result  = await Post.deleteOne({_id : postId});
    res.status(200).send({
      success: true,
      message: "Successful post deletion",
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

// Fetch User's Posts API 
app.get("/api/posts/:userId", async (req, res) => {
  const {userId} = req.params;
  try{
    const result = await Post.find({userId : userId});
    res.status(200).send({
      success: true,
      message: "All the posts from the user",
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("DB Connection successfully");
      console.log("Server is up and listening on", process.env.PORT);
    })
    .catch((err) => console.log("Something went wrong"));
});
