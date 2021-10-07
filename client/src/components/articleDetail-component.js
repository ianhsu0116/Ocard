import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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
  let [buttonStatus, setButtonStatus] = useState("disabled");
  let [currentImage, setCurrentImage] = useState(null);
  let history = useHistory();
  let date = new Date();

  // 判斷資料是否有填寫
  useEffect(() => {
    if (currentComment.length >= 1 && currentComment.length < 200) {
      setButtonStatus(false);
    } else {
      setButtonStatus("disabled");
    }
  }, [currentComment]);

  // 即時追蹤comment內容
  const handleCommentText = (e) => {
    setCurrentComment(e.target.value);
  };

  // 即時顯示圖片
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

  // 手動刪除圖片
  const handleCloseImage = () => {
    setCurrentImage(null);
  };

  // 送出留言
  const handleSubmit = (e) => {
    if (!currentUser) {
      window.alert("請先登入才可以留言歐！！");
      history.push("/login");
      return;
    }
    let comment_id = uuidv4();
    let _id = e.target.dataset.articleid;
    let user_id = currentUser.user._id;
    let now = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    ArticleService.postComment(
      comment_id,
      _id,
      user_id,
      currentComment,
      now,
      currentImage
    )
      .then(() => {
        window.alert("新增成功！");

        // 清空textarea + 圖片
        setCurrentComment("");
        setCurrentImage(null);

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
        window.alert(err.response.data);
      });
  };

  let [likeWhichComment, setLikeWhichComment] = useState([]);
  // 按讚、收回按讚(留言)
  const handleLikeClick = (e) => {
    if (currentUser) {
      let comment_id = e.currentTarget.dataset.commentid;

      let likeCount = e.currentTarget.parentElement.children[1];
      let likeCountNumber = Number(
        e.currentTarget.parentElement.children[1].innerText
      );
      if (likeWhichComment.includes(comment_id)) {
        // 移除原有的comment_id
        likeWhichComment.forEach((commentid, index) => {
          if (commentid == comment_id) {
            likeWhichComment.splice(index, 1);
          }
        });

        // 按讚數增減
        if (e.currentTarget.classList.contains("likesActive")) {
          likeCountNumber--;
          likeCount.innerText = likeCountNumber;
        } else {
          likeCountNumber++;
          likeCount.innerText = likeCountNumber;
        }
        e.currentTarget.classList.toggle("likesActive");
      } else {
        // 新增comment_id
        likeWhichComment.push(comment_id);

        // 按讚數增減
        if (e.currentTarget.classList.contains("likesActive")) {
          likeCountNumber--;
          likeCount.innerText = likeCountNumber;
        } else {
          likeCountNumber++;
          likeCount.innerText = likeCountNumber;
        }
        e.currentTarget.classList.toggle("likesActive");
      }
      setLikeWhichComment(likeWhichComment);
    } else {
      window.alert("登入後才可以按讚留言啦！");
    }
  };
  // 按下關閉鈕時
  const handleClose = () => {
    // 控制ArticleDetail的這個element的開啟關閉
    setArticleDetailOpen(false);
    setCurrentDetailData(null);

    if (currentUser) {
      // 送出留言的按讚
      let _id = currentDetailData._id;
      let user_id = currentUser.user._id;

      likeWhichComment.forEach((comment_id) => {
        ArticleService.postLikes(_id, comment_id, user_id)
          .then(() => {
            console.log("按讚編輯成功");
          })
          .catch((err) => {
            console.log(err.response);
            console.log("err");
          });
      });
      // 重置當前按讚的所有留言
      setLikeWhichComment([]);
    }
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
            <button onClick={handleClose} className="close-btn">
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
            <div className="articleDetail-text">
              {currentDetailData.content}

              {currentDetailData.image.length > 0 && (
                <div className="articleDetail-img-con">
                  <img src={currentDetailData.image[0]} />
                </div>
              )}
            </div>
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
                          <div className="email">{comment.user_id.email}</div>
                          <div className="time-floor">
                            <span className="floor">B{index + 1}</span>
                            <span> · </span>
                            <span className="time">{comment.date}</span>
                          </div>
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              comment.text &&
                              comment.text.replaceAll("\n", "<br/>"),
                          }}
                          className="articleDetail-comment-mid-text"
                        />
                        {comment.image.length >= 1 &&
                          comment.image.map((img) => (
                            <div className="articleDetail-comment-mid-img">
                              <img src={img} />
                            </div>
                          ))}
                      </div>
                      <div className="articleDetail-comment-right">
                        <div className="articleDetail-comment-right-likes">
                          {currentUser &&
                            comment.likes.length > 0 &&
                            comment.likes.some(
                              (likeid) => likeid == currentUser.user._id
                            ) && (
                              <button
                                className="icon-con likesActive"
                                data-articleid={currentDetailData._id}
                                data-commentid={comment.comment_id}
                                onClick={handleLikeClick}
                              >
                                {CommentIcons.CommentLikeIcon()}
                              </button>
                            )}
                          {currentUser &&
                            comment.likes.every(
                              (likeid) => likeid != currentUser.user._id
                            ) && (
                              <button
                                className="icon-con"
                                data-articleid={currentDetailData._id}
                                data-commentid={comment.comment_id}
                                onClick={handleLikeClick}
                              >
                                {CommentIcons.CommentLikeIcon()}
                              </button>
                            )}
                          {!currentUser && (
                            <button
                              className="icon-con"
                              data-articleid={currentDetailData._id}
                              data-commentid={comment.comment_id}
                              onClick={handleLikeClick}
                            >
                              {CommentIcons.CommentLikeIcon()}
                            </button>
                          )}

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
              placeholder="回應前請詳閱全站站規和本板板規。(長度限制：0~200字元)"
              value={currentComment}
            ></textarea>
            {currentImage && (
              <div className="articleDetail-comment-input-img">
                <img src={currentImage} />
                <button onClick={handleCloseImage} className="close-btn">
                  {CloseButtonIcon()}
                </button>
              </div>
            )}
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
