const router = require("express").Router();
const Article = require("../models").articleModel;

router.use((req, res, next) => {
  console.log("A request is coming in openArticle-route");
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
    .populate("comment.user_id", ["email"])
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

module.exports = router;
