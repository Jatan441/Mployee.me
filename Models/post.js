import mongoose from "mongoose";

const Post = mongoose.model("Post", {
    userId : String,
    content : String
});

export default Post;