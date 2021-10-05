import axios from "axios";
const API_URL = "http://localhost:7777/api/article";
const OPEN_API_URL = "http://localhost:7777/api/open-article";

class ArticleService {
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
  get() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(OPEN_API_URL + "/", {
      headers: {
        Authorization: token,
      },
    });
  }

  getById(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(OPEN_API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

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
