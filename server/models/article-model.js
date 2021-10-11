const mongoose = require("mongoose");
let date = new Date();
const articleSchema = new mongoose.Schema({
  board: {
    type: String,
    enum: [
      "NBA",
      "健身",
      "外送",
      "居家",
      "心情",
      "感情",
      "星座",
      "時事",
      "有趣",
      "梗圖",
      "烹飪",
      "理財",
      "穿搭",
      "網購",
      "西斯",
    ],
    required: true,
  },
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
  likes: {
    type: [String], // 裝按讚的user_id
  },
  image: {
    type: [String], // 文章的圖片
  },
  comment: [
    {
      comment_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        minLength: 1,
        maxLength: 200,
        required: true,
      },
      likes: {
        type: [String], // 裝按讚的user_id
      },
      image: {
        type: [String], // 留言的圖片
      },
      date: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
