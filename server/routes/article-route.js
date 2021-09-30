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

// post新文章
router.post("/", async (req, res) => {
  // validate the input before making a new course
  const { error } = articleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, content, author } = req.body;
  let newArticle = new Article({
    title,
    content,
    author,
  });

  try {
    await newArticle.save();
    res.status(200).send("New Article has been saved!");
  } catch (err) {
    res.status(400).send("cannot save article");
  }
});

module.exports = router;
