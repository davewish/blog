const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    name: String,
    userID: String,
  },
});
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
