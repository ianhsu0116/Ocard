import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ArticleService from "../services/article.service";
import BoardSelectorComponent from "./boardSelector-component";
import GenderIcons from "./icons/GenderIcons";
import UploadImgIcon from "./icons/UploadImgIcon";

const PostArticleComponent = (props) => {
  let { boards, currentUser, setCurrentUser } = props;
  let date = new Date();
  let [boardOpen, setBoardOpen] = useState(false);
  let [currentBoard, setCurrentBoard] = useState("點此選擇發文看板");
  let [currentTitle, setCurrentTitle] = useState("");
  let [currentContent, setCurrentContent] = useState("");
  let [currentImage, setCurrentImage] = useState(null);
  let [now, setNow] = useState(
    date.toLocaleDateString() + " " + date.toLocaleTimeString()
  );

  // 確認當前是否登入
  let history = useHistory();
  useEffect(() => {
    if (!currentUser) {
      window.alert("請先登入才能po文歐歐歐歐！！！！");
      history.push("/login");
    }
  }, []);

  // 判斷資料是否有填寫
  useEffect(() => {
    let submitBtn = document.querySelector("#submit-btn");
    if (
      currentBoard !== "點此選擇發文看板" &&
      currentTitle.length >= 6 &&
      currentContent.length >= 10
    ) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add("disabled");
    }
  }, [currentBoard, currentTitle, currentContent]);

  // 控制看板選擇箱子是否開啟
  const handleOpenBoard = (e) => {
    e.stopPropagation();
    setBoardOpen(true);
  };
  const handleCloseBoard = (e) => {
    e.stopPropagation();
    setBoardOpen(false);
  };

  // 防止按下enter直接送出
  const preventTitleSubmit = (e) => {
    let code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      e.preventDefault();
    }
  };
  // 即時抓取title
  const handleChangeTitle = (e) => {
    setCurrentTitle(e.target.value);
  };
  // 即時抓取content
  const handleChangeContent = (e) => {
    setCurrentContent(e.target.value);
  };

  // 即時抓取上傳的圖片  error
  const handleFileChange = (e) => {
    let readFile = new FileReader(); //constructor 建構子(函數); 功能: 給初值
    let file = e.target.files[0];
    let imageType = /image.*/;

    // 格式符合就顯示，否則提醒
    if (file) {
      if (file.type.match(imageType) && file.size < 80000) {
        readFile.readAsDataURL(file);
        readFile.addEventListener("load", function () {
          setCurrentImage(readFile.result);
        });
      } else {
        window.alert("只能上傳圖片歐！(檔案大小須小於80kb)");
      }
    }
  };

  // 送出文章
  const handleSubmit = (e) => {
    let author = currentUser.user._id;
    let board = currentBoard;
    let title = currentTitle;
    let content = currentContent;
    let image = currentImage;

    // 有圖片的情況
    if (currentImage) {
      ArticleService.post(board, title, content, author, image)
        .then(() => {
          window.alert("發佈成功！");
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
          console.log("error1");
          window.alert(err.response.data);
        });
    }
    // 沒圖片的情況
    else {
      ArticleService.post(board, title, content, author)
        .then(() => {
          window.alert("發佈成功！");
          history.push("/");
        })
        .catch((err) => {
          console.log(err.response);
          console.log("error2");
          window.alert(err.response.data);
        });
    }
  };

  return (
    <div onClick={handleCloseBoard} className="postArticle">
      {boardOpen && (
        <BoardSelectorComponent
          boards={boards}
          setBoardOpen={setBoardOpen}
          currentBoard={currentBoard}
          setCurrentBoard={setCurrentBoard}
        />
      )}

      {currentUser && (
        <form className="form-con">
          <div className="form-con-title">發表文章</div>
          <div className="select-board">
            <button
              onClick={handleOpenBoard}
              type="button"
              className="board-selector"
            >
              {currentBoard}
              <img src={require("./images/down.svg").default}></img>
            </button>
          </div>
          <div className="author-con">
            <div className="author-avatar">{GenderIcons.GenderDIcon()}</div>
            <div className="author-con-right">
              <div className="author">{currentUser.user.email}</div>
              <div className="currentTime">{now}</div>
            </div>
          </div>
          <div className="content-con">
            <div className="post-title">
              <input
                type="text"
                onKeyPress={preventTitleSubmit}
                onChange={handleChangeTitle}
                placeholder="標題"
              ></input>
            </div>
            <div className="post-text">
              <textarea
                onChange={handleChangeContent}
                placeholder="歡迎分享任何你生活上遇到的大小事情...."
              ></textarea>
            </div>
          </div>
          {currentImage && (
            <div className="temp-img-con">
              <img src={currentImage} />
            </div>
          )}

          <div className="footer-con">
            <div className="form-footer d-flex">
              <div>
                <label htmlFor="img-upload" className="img-icon">
                  {UploadImgIcon()}
                </label>
                <input
                  onChange={handleFileChange}
                  type="file"
                  id="img-upload"
                  multiple
                ></input>
              </div>
              <button
                id="submit-btn"
                onClick={handleSubmit}
                type="button"
                className="disabled"
              >
                發布文章
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostArticleComponent;
