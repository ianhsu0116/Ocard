import axios from "axios";
const API_URL = "http://localhost:7777/api/article";
const OPEN_API_URL = "http://localhost:7777/api/open-article";

class ArticleService {
  // 新增文章
  post(board, title, content, author, image) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    if (image) {
      return axios.post(
        API_URL + "/",
        {
          board,
          title,
          content,
          author,
          image,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } else {
      return axios.post(
        API_URL + "/",
        {
          board,
          title,
          content,
          author,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
  }

  // 拿所有文章
  get() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(OPEN_API_URL + "/");
  }

  // 拿到特定文章
  getById(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(OPEN_API_URL + "/" + _id);
  }

  // 依照看板拿文章
  getByBoard(board) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(OPEN_API_URL + "/board/" + board);
  }

  // 新增留言
  postComment(_id, user_id, text, date, image) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    // 判斷有無圖片
    if (image) {
      return axios.post(
        API_URL + "/comment/" + _id,
        {
          user_id,
          text,
          image,
          date,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } else {
      return axios.post(
        API_URL + "/comment/" + _id,
        {
          user_id,
          text,
          date,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
  }
}

export default new ArticleService();
