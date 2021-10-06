const router = require("express").Router();
const Article = require("../models").articleModel;
const articleValidation = require("../validation").articleValidation;
const commentValidation = require("../validation").commentValidation;

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

// 拿到所有文章
// router.get("/", (req, res) => {
//   Article.find({})
//     .populate("author", ["email"])
//     .then((article) => {
//       res.status(200).send(article);
//     })
//     .catch((err) => {
//       res.status(500).send("can not find any article");
//     });
// });

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

// 依照board拿到文章
// router.get("/board/:board_name", (req, res) => {
//   let { board_name } = req.params;
//   Article.find({ board: board_name })
//     .populate("author", ["email"])
//     .then((article) => {
//       res.status(200).send(article);
//     })
//     .catch((err) => {
//       res.status(500).send("can not find any article");
//     });
// });

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
router.post("/", async (req, res) => {
  // validate the input before making a new article
  const { error } = articleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { board, title, content, author, image } = req.body;
  let newArticle;
  if (req.body.hasOwnProperty("image")) {
    newArticle = new Article({
      board,
      title,
      content,
      author,
      image,
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
router.post("/comment/:_id", async (req, res) => {
  // validate the input before making a new comment
  const { error } = commentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let { comment_id, user_id, text, date, image } = req.body;
  let newComment;
  if (req.body.hasOwnProperty("image")) {
    newComment = {
      comment_id,
      user_id,
      text,
      image,
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

// 按讚或是收回讚
router.post("/comment/likes/:_id", async (req, res) => {
  let { _id } = req.params;
  let { comment_id, user_id } = req.body;
  try {
    let article = await Article.findById({ _id });
    // 找到要新增或是取消讚的comment
    article.comment.forEach((com) => {
      if (com.comment_id === comment_id) {
        //找到後尋找當前傳入的user_id是否存在於Likes內
        let isContain = com.likes.find((like) => like == user_id);
        // 存在的話就刪除，否則新增
        if (isContain) {
          com.likes.forEach((userid, index) => {
            if (userid == user_id) {
              com.likes.splice(index, 1);
            }
          });
        } else {
          com.likes.push(user_id);
        }
      }
    });
    article.save();
    res.status(200).send("Like has been edit");
  } catch (err) {
    res.status(400).send("cannot delete like");
  }
});

module.exports = router;
