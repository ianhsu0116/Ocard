import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ArticleService from "../services/article.service";
import BoardSelectorComponent from "./BoardSelector-component";
import GenderIcons from "./icons/GenderIcons";
import UploadImgIcon from "./icons/UploadImgIcon";
import CloseButtonIcon from "./icons/CloseButtonIcon";

const PostArticleComponent = (props) => {
  let { boards, currentUser } = props;
  let date = new Date();
  let [boardOpen, setBoardOpen] = useState(false);
  let [currentBoard, setCurrentBoard] = useState("點此選擇發文看板");
  let [currentTitle, setCurrentTitle] = useState("");
  let [currentContent, setCurrentContent] = useState("");
  let [currentImage, setCurrentImage] = useState(null); // 即時顯示所選圖檔(二元編碼)
  let [awsFile, setAwsFile] = useState(null); // 儲存要送到server, 存入AWS S3的image file
  let [buttonStatus, setButtonStatus] = useState("disabled"); // 送出按鈕狀態
  let [now, setNow] = useState(
    date.toLocaleDateString() + " " + date.toLocaleTimeString()
  );

  //console.log(date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }));

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
    if (
      currentBoard !== "點此選擇發文看板" &&
      currentTitle.length >= 6 &&
      currentContent.length >= 10
    ) {
      setButtonStatus(false);
    } else {
      setButtonStatus("disabled");
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

  // 防止input按下enter直接送出
  const preventTitleSubmit = (e) => {
    let code = e.keyCode ? e.keyCode : e.which;
    if (code === 13) {
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

  // 即時抓取上傳的圖片
  const handleFileChange = (e) => {
    let readFile = new FileReader(); //constructor 建構子(函數); 功能: 給初值
    let file = e.target.files[0];
    let imageType = /image.*/;

    // 格式符合就顯示，否則提醒
    if (file) {
      if (file.type.match(imageType) && file.size < 4000000) {
        // 將圖裝入，等待送到後端
        setAwsFile(file);

        // 抓到二元編碼，即時顯示
        readFile.readAsDataURL(file);
        readFile.addEventListener("load", function () {
          setCurrentImage(readFile.result);
        });
      } else {
        window.alert("只能上傳圖片歐！(檔案須小於4mb)");
      }
    }
  };

  // 刪除暫存圖片(即時顯示)
  const handleCloseImage = () => {
    console.log("delete");
    setCurrentImage(null);
    setAwsFile(null);
  };

  // 送出文章
  const handleSubmit = (e) => {
    // 送出當下就將按鍵disabled，防止重複送出
    setButtonStatus("disabled");
    let author = currentUser.user._id;
    let board = currentBoard;
    let title = currentTitle;
    let content = currentContent;
    let image = awsFile;

    // 有圖片的情況
    if (currentImage) {
      ArticleService.post(board, title, content, author, image)
        .then(() => {
          window.alert("發佈成功！");
          history.push("/");
        })
        .catch((err) => {
          console.log(err.response);
          //console.log("postArticleError1");
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
          //console.log("postArticleError2");
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
              <img
                src={require("./images/down.svg").default}
                alt="downArror"
              ></img>
            </button>
          </div>
          <div className="author-con">
            <div className="author-avatar">
              {currentUser.user.gender === "female" && GenderIcons.GirlIcon()}
              {currentUser.user.gender === "male" && GenderIcons.BoyIcon()}
            </div>
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
            <div className="temp-img-box">
              <div className="temp-img-con">
                <img src={currentImage} alt="即時顯示上傳圖片" />
                <button onClick={handleCloseImage} className="close-btn">
                  {CloseButtonIcon()}
                </button>
              </div>
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
                onClick={handleSubmit}
                type="button"
                className={buttonStatus}
                disabled={buttonStatus}
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
