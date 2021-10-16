const router = require("express").Router();
const Article = require("../models").articleModel;
const articleValidation = require("../validation").articleValidation;
const commentValidation = require("../validation").commentValidation;
const { uploadFile, getFileStream } = require("../config/aws-s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use((req, res, next) => {
  console.log("A request is coming in article-route");
  next();
});

// 測試API
router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.json(msgObj);
});

// 依照文章ID
router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Article.findOne({ _id })
    .populate("author", ["email"])
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      res.status(500).send("can not find any article");
    });
});

// 依照user_id拿到所有他發布的文章
router.get("/user/:_user_id", (req, res) => {
  let { _user_id } = req.params;
  Article.find({ author: _user_id })
    .populate("author", ["email"])
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      res.status(500).send("can not find any article");
    });
});

// post新文章
router.post("/", upload.single("image"), async (req, res) => {
  // validate the input before making a new article
  const { error } = articleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 抓到formData內的image file
  let result;
  const file = req.file;
  if (file) {
    // 上傳至AWS S3
    result = await uploadFile(file);
    // 刪除暫存檔案
    await unlinkFile(file.path);
  }

  let { board, title, content, author } = req.body;
  let newArticle;
  if (result) {
    newArticle = new Article({
      board,
      title,
      content,
      author,
      image: result.Location,
    });
  } else {
    newArticle = new Article({
      board,
      title,
      content,
      author,
    });
  }

  try {
    await newArticle.save();
    res.status(200).send("New Article has been saved!");
  } catch (err) {
    res.status(400).send("cannot save article");
  }
});

// 新增文章留言
router.post("/comment/:_id", upload.single("image"), async (req, res) => {
  // validate the input before making a new comment
  const { error } = commentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 抓到formData內的image file
  let result;
  const file = req.file;
  if (file) {
    // 上傳至AWS S3
    result = await uploadFile(file);
    // 刪除暫存檔案
    await unlinkFile(file.path);
  }

  let { _id } = req.params;
  let { comment_id, user_id, text, date } = req.body;
  let newComment;
  if (result) {
    newComment = {
      comment_id,
      user_id,
      text,
      image: result.Location,
      date,
    };
  } else {
    newComment = {
      comment_id,
      user_id,
      text,
      date,
    };
  }

  try {
    let article = await Article.findById({ _id });
    await article.comment.push(newComment);
    article.save();
    res.status(200).send("New Comment has been saved!");
  } catch (err) {
    res.status(400).send("cannot save article");
  }
});

// 按讚或是收回讚(article)
router.post("/likes/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    // 找到要新增或是取消讚的article
    let article = await Article.findById({ _id });
    let isExist = article.likes.includes(user_id);

    // 存在就刪除，不存在則新增
    if (isExist) {
      article.likes.forEach((userid, index) => {
        if (userid == user_id) {
          article.likes.splice(index, 1);
        }
      });
    } else {
      article.likes.push(user_id);
    }

    article.save();
    res.status(200).send("Article like has been edit ");
  } catch (err) {
    res.status(400).send("cannot edit likes from article");
  }
});

// 按讚或是收回讚(comment)
router.post("/comment/likes/:_id", async (req, res) => {
  let { _id } = req.params;
  let { comment_id_arr, user_id } = req.body;

  try {
    let article = await Article.findById({ _id });
    // 找到要新增或是取消讚的comment
    await comment_id_arr.forEach((currentComId) => {
      article.comment.forEach((com) => {
        if (com.comment_id == currentComId) {
          // 尋找當前傳入的user_id是否存在於Likes內
          let index = com.likes.indexOf(user_id);

          //存在的話就刪除，否則新增
          if (index >= 0) {
            com.likes.splice(index, 1);
          } else {
            com.likes.push(user_id);
          }
        }
      });
    });

    article.save();
    res.status(200).send("Comment like has been edit");
  } catch (err) {
    res.status(400).send("cannot edit likes from comment");
  }
});

module.exports = router;
