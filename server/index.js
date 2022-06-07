const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./routes").auth;
const articleRoute = require("./routes").article;
const openArticleRoute = require("./routes").openArticle;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// connect to mongoDB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongo Atlas");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use("/api/user", authRoute);
app.use("/api/open-article", openArticleRoute); // 給未登入者看文章用
app.use(
  "/api/article",
  passport.authenticate("jwt", { session: false }),
  articleRoute
);

const PORT = 80;

// port listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
