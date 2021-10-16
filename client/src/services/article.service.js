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

    const formData = new FormData();
    formData.append("board", board);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("image", image);

    if (image) {
      return axios.post(API_URL + "/", formData, {
        headers: {
          Authorization: token,
        },
      });
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
    return axios.get(OPEN_API_URL + "/");
  }

  // 根據_id拿到特定文章
  getById(_id) {
    return axios.get(OPEN_API_URL + "/" + _id);
  }

  // 依照看板拿文章
  getByBoard(board) {
    return axios.get(OPEN_API_URL + "/board/" + board);
  }

  // 依照搜尋條件拿文章
  getBySearch(input, currentSidebarBoard) {
    //判斷這次是否需要依照看板下去搜尋
    if (currentSidebarBoard) {
      return axios.post(OPEN_API_URL + "/search/" + input, {
        board: currentSidebarBoard,
      });
    } else {
      return axios.post(OPEN_API_URL + "/search/" + input);
    }
  }

  // 新增留言
  postComment(comment_id, _id, user_id, text, date, image) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    const formData = new FormData();
    formData.append("comment_id", comment_id);
    formData.append("user_id", user_id);
    formData.append("text", text);
    formData.append("date", date);
    formData.append("image", image);

    // 判斷有無圖片
    if (image) {
      return axios.post(API_URL + "/comment/" + _id, formData, {
        headers: {
          Authorization: token,
        },
      });
    } else {
      return axios.post(
        API_URL + "/comment/" + _id,
        {
          comment_id,
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

  // 按讚或是取消按讚(article)
  postArticleLikes(_id, user_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL + "/likes/" + _id,
      {
        user_id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 按讚或是取消按讚(comment)
  postCommentLikes(_id, comment_id_arr, user_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL + "/comment/likes/" + _id,
      {
        comment_id_arr,
        user_id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new ArticleService();
