const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 6,
    maxLength: 50,
    required: true,
  },
  content: {
    type: String,
    minLength: 10,
    maxLength: 1000,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // 存另一個Schema的id，此為正式寫法
    ref: "User", // 連結到User Model, User => 一定要符合開頭大寫,不可複數的格式
    required: true,
  },
  like: {
    type: [String], // 裝按讚的user_id
  },
  comment: {
    type: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          minLength: 1,
          maxLength: 100,
          required: true,
        },
        like: {
          type: [String], // 裝按讚的user_id
        },
      },
    ],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
