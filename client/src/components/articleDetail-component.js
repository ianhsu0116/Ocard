import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ArticleService from "../services/article.service";
import GenderIcons from "./icons/GenderIcons";
import CommentIcons from "./icons/CommentIcons";
import CloseButtonIcon from "./icons/CloseButtonIcon";
import UploadImgIcon from "./icons/UploadImgIcon";

const ArticleDetailComponent = (prop) => {
  let {
    currentUser,
    setArticleDetailOpen,
    currentDetailData,
    setCurrentDetailData,
  } = prop;
  let [currentComment, setCurrentComment] = useState("");
  let [newComment, setNewComment] = useState([]);
  let [buttonStatus, setButtonStatus] = useState("disabled");
  let history = useHistory();
  let date = new Date();
  // 按下關閉鈕時
  const handleClose = () => {
    setArticleDetailOpen(false);
    setCurrentDetailData(null);
  };

  // 判斷資料是否有填寫
  useEffect(() => {
    if (currentComment.length >= 1) {
      setButtonStatus(false);
    } else {
      setButtonStatus("disabled");
    }
  }, [currentComment]);

  // 即時追蹤comment內容
  const handleCommentText = (e) => {
    setCurrentComment(e.target.value);
    //console.log(currentDetailData);
  };

  // 即時顯示圖片
  const handleFileChange = (e) => {
    console.log("Good");
  };

  // 送出留言
  const handleSubmit = (e) => {
    if (!currentUser) {
      window.alert("請先登入才可以留言歐！！");
      history.push("/");
      return;
    }
    let _id = e.target.dataset.articleid;
    let user_id = currentUser.user._id;
    let now = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    ArticleService.postComment(_id, user_id, currentComment, now)
      .then(() => {
        //console.log("新增成功");
        // 成功的話，即時顯示新留言
        ArticleService.getById(currentDetailData._id)
          .then((data) => {
            //console.log(data.data);
            setCurrentDetailData(data.data);
          })
          .catch((err) => {
            window.alert("發生錯誤，正在處理中！");
            //console.log(err);
          });
      })
      .catch((err) => {
        console.log(err.response);
        window.alert(err.response);
      });
  };
  return (
    <div className="articleDetail">
      {currentDetailData && (
        <div className="articleDetail-con">
          <div className="articleDetail-header">
            <div className="authorDetail">
              <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
              <div className="email">{currentDetailData.author.email}</div>
            </div>
            <button onClick={handleClose} className="close-btb">
              {CloseButtonIcon()}
            </button>
          </div>
          <div className="articleDetail-content">
            <div className="articleDetail-title">
              <h3>{currentDetailData.title}</h3>
            </div>
            <div className="articleDetail-middle">
              <div className="articleDetail-board">
                {currentDetailData.board} ·
              </div>
              <div className="articleDetail-time">{currentDetailData.date}</div>
            </div>
            <pre className="articleDetail-text">
              {currentDetailData.content}
              {currentDetailData.image.length > 0 && (
                <div className="articleDetail-img-con">
                  <img src={currentDetailData.image[0]} />
                </div>
              )}
            </pre>
            <div className="likesIcon-con">
              <div className="icons">
                <button>
                  <img src={require("./images/like.png").default} alt="like" />
                </button>
                <button>
                  <img
                    src={require("./images/happy.png").default}
                    alt="happy"
                  />
                </button>
                <button>
                  <img
                    src={require("./images/angry.png").default}
                    alt="angry"
                  />
                </button>
                <div className="likeCount">
                  {currentDetailData.likes.length}
                </div>
                <button>{CommentIcons.CommentIcon()}</button>
                <div className="commentCount">
                  {currentDetailData.comment.length}
                </div>
              </div>
            </div>
            <div className="articleDetail-comment">
              <div className="articleDetail-comment-header">
                <div>共 {currentDetailData.comment.length} 則留言</div>
              </div>
              <div className="articleDetail-comment-box">
                {currentDetailData.comment &&
                  currentDetailData.comment.length >= 1 &&
                  currentDetailData.comment.map((comment, index) => (
                    <div className="articleDetail-comment-con">
                      <div className="articleDetail-comment-left">
                        <div className="genderIcon">
                          {GenderIcons.GirlIcon()}
                        </div>
                      </div>
                      <div className="articleDetail-comment-mid">
                        <div className="articleDetail-comment-mid-title">
                          <div className="email">{comment.user_id}</div>
                          <div className="time-floor">
                            <span className="floor">B{index + 1}</span>
                            <span> · </span>
                            <span className="time">{comment.date}</span>
                          </div>
                        </div>
                        <div className="articleDetail-comment-mid-text">
                          {comment.text}
                        </div>
                        {comment.image.length >= 1 &&
                          comment.image.map((img) => (
                            <div className="articleDetail-comment-mid-img">
                              <img src={img} />
                            </div>
                          ))}
                      </div>
                      <div className="articleDetail-comment-right">
                        <div className="articleDetail-comment-right-likes">
                          <button className="icon-con">
                            {CommentIcons.CommentLikeIcon()}
                          </button>
                          <div className="likeCount">
                            {comment.likes.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="articleDetail-comment-input">
            <textarea
              onChange={handleCommentText}
              placeholder="回應前請詳閱全站站規和本板板規。"
            ></textarea>
          </div>
          <div className="articleDetail-footer">
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
              className={buttonStatus}
              disabled={buttonStatus}
              data-articleid={currentDetailData._id}
            >
              送出留言
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailComponent;
