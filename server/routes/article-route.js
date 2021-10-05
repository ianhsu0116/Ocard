const router = require("express").Router();
const Article = require("../models").articleModel;
const articleValidation = require("../validation").articleValidation;

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
router.get("/", (req, res) => {
  Article.find({})
    .populate("author", ["email"])
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      res.status(500).send("can not find any article");
    });
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

// 依照board拿到文章
router.get("/board/:board_name", (req, res) => {
  let { board_name } = req.params;
  Article.find({ board: board_name })
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
router.post("/", async (req, res) => {
  // validate the input before making a new course
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

// 文章留言

module.exports = router;
