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
  let [buttonStatus, setButtonStatus] = useState("disabled"); // 送出button狀態
  let [currentImage, setCurrentImage] = useState(null); // 即時顯示所選圖檔(二元編碼)
  let [awsFile, setAwsFile] = useState(null); // 儲存要送到server, 存入AWS S3的image file
  let [likeWhichComment, setLikeWhichComment] = useState([]);
  let [isArticleLike, setIsArticleLike] = useState(false);
  let [isNeedEditArticleLike, setIsNeedEditArticleLike] = useState(false);
  let history = useHistory();
  let date = new Date();

  // 判斷當前使用者是否已經對當前文章按過讚
  useEffect(() => {
    if (currentUser) {
      if (currentDetailData) {
        if (currentDetailData.likes.includes(currentUser.user._id)) {
          setIsArticleLike(true);
        }
      }
    }
  }, [currentDetailData]);

  // 判斷留言內是否有填寫文字
  useEffect(() => {
    if (currentComment.length >= 1 && currentComment.length < 200) {
      setButtonStatus(false);
    } else {
      setButtonStatus("disabled");
    }
  }, [currentComment]);

  // 判斷是否要送出文章按讚
  useEffect(() => {
    if (currentUser) {
      if (isNeedEditArticleLike) {
        let _id = currentDetailData._id;
        let user_id = currentUser.user._id;
        // 送出文章的按讚編輯
        ArticleService.postArticleLikes(_id, user_id)
          .then(() => {
            console.log("文章按讚編輯成功");
            setIsNeedEditArticleLike(false);
          })
          .catch((err) => {
            console.log(err.response);
            console.log("err");
          });
      }
    }
  }, [isNeedEditArticleLike]);

  // 即時追蹤comment內容
  const handleCommentText = (e) => {
    setCurrentComment(e.target.value);
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
        window.alert("只能上傳圖片歐！(檔案大小須小於4mb)");
      }
    }
  };

  // 刪除暫存圖片(即時顯示)
  const handleCloseImage = () => {
    setCurrentImage(null);
    setAwsFile(null);
  };

  // 送出留言
  const handleCommentSubmit = (e) => {
    if (!currentUser) {
      window.alert("請先登入才可以留言歐！！");
      history.push("/login");
      return;
    }

    // 防止多次按壓submit btn，會有bug
    setButtonStatus("disabled");

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
      awsFile
    )
      .then(() => {
        window.alert("新增成功！");

        // 清空textarea + 圖片
        setCurrentComment("");
        setCurrentImage(null);

        // 成功的話，即時顯示新留言（重新fetch一次當前文章詳細資料）
        ArticleService.getById(currentDetailData._id)
          .then((data) => {
            //console.log(data.data);
            setCurrentDetailData(data.data);
          })
          .catch((err) => {
            window.alert("發生錯誤，正在處理中！(新增留言)");
            //console.log(err);
          });
      })
      .catch((err) => {
        console.log(err.response);
        window.alert("新增留言異常，正在處理中！");
      });
  };

  // 按讚、收回按讚(文章)
  const handleArticleLike = (e) => {
    if (currentUser) {
      // 一按下文章的讚，就代表這次有需要進資料庫更改
      setIsNeedEditArticleLike(true);

      // 先抓到當前留言 原有的按讚數量
      let currentArticleLikesCount = Number(
        document.querySelector(".likeCount").innerText
      );

      // 判斷當前使用者是否有對當前文章按讚
      if (isArticleLike) {
        setIsArticleLike(false);
        document.querySelector(".likeCount").innerText =
          currentArticleLikesCount - 1;
      } else {
        setIsArticleLike(true);
        document.querySelector(".likeCount").innerText =
          currentArticleLikesCount + 1;
      }
    } else {
      window.alert("登入後才可以按讚留言啦！");
    }
  };

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
          if (commentid === comment_id) {
            likeWhichComment.splice(index, 1);
          }
        });
      } else {
        // 新增comment_id
        likeWhichComment.push(comment_id);
      }

      setLikeWhichComment(likeWhichComment);

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
      window.alert("登入後才可以按讚留言啦！");
    }
  };

  // 按下關閉鈕時
  const handleClose = () => {
    // 控制ArticleDetail的這個element的開啟關閉
    setArticleDetailOpen(false);

    // 移除當前的文章內容
    setCurrentDetailData(null);

    // 使 root 無法滾動
    document.querySelector("body").classList.remove("stopScroll");

    // 目前有人登入的話，確認有無要送出的按讚(留言的)
    if (currentUser) {
      // 送出留言的按讚
      let _id = currentDetailData._id;
      let user_id = currentUser.user._id;

      //console.log(likeWhichComment);

      if (likeWhichComment.length > 0) {
        ArticleService.postCommentLikes(_id, likeWhichComment, user_id)
          .then(() => {
            console.log("留言按讚編輯成功");
          })
          .catch((err) => {
            console.log(err.response);
            console.log("err");
          });
        // 重置當前按讚的所有留言
        setLikeWhichComment([]);
      }
    }
  };

  return (
    <div className="articleDetail">
      {currentDetailData && (
        <div className="articleDetail-con">
          <div className="articleDetail-header">
            <div className="authorDetail">
              <div className="genderIcon">
                {currentDetailData.author.gender === "female" &&
                  GenderIcons.GirlIcon()}
                {currentDetailData.author.gender === "male" &&
                  GenderIcons.BoyIcon()}
              </div>
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
              <div className="articleDetail-time">
                {new Date(currentDetailData.date).toLocaleDateString()} -
                {new Date(currentDetailData.date).toLocaleTimeString()}
              </div>
            </div>
            <div className="articleDetail-text">
              {currentDetailData.content}

              {currentDetailData.image.length > 0 && (
                <div className="articleDetail-img-con">
                  <img src={currentDetailData.image[0]} alt="articleImage" />
                </div>
              )}
            </div>
            <div className="likesIcon-con">
              <div className="icons">
                <button onClick={handleArticleLike}>
                  <img src={require("./images/like.png").default} alt="like" />
                </button>
                <button onClick={handleArticleLike}>
                  <img
                    src={require("./images/happy.png").default}
                    alt="happy"
                  />
                </button>
                <button onClick={handleArticleLike}>
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
                    <div
                      key={comment._id}
                      className="articleDetail-comment-con"
                    >
                      <div className="articleDetail-comment-left">
                        <div className="genderIcon">
                          {comment.user_id.gender === "female" &&
                            GenderIcons.GirlIcon()}
                          {comment.user_id.gender === "male" &&
                            GenderIcons.BoyIcon()}
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
                          comment.image.map((img, index) => (
                            <div
                              key={index}
                              className="articleDetail-comment-mid-img"
                            >
                              <img src={img} alt="commentImage" />
                            </div>
                          ))}
                      </div>
                      <div className="articleDetail-comment-right">
                        <div className="articleDetail-comment-right-likes">
                          {currentUser &&
                            comment.likes.length > 0 &&
                            comment.likes.some(
                              (likeid) => likeid === currentUser.user._id
                            ) && (
                              <button
                                className="icon-con likesActive"
                                data-commentid={comment.comment_id}
                                onClick={handleLikeClick}
                              >
                                {CommentIcons.CommentLikeIcon()}
                              </button>
                            )}
                          {currentUser &&
                            comment.likes.every(
                              (likeid) => likeid !== currentUser.user._id
                            ) && (
                              <button
                                className="icon-con"
                                data-commentid={comment.comment_id}
                                onClick={handleLikeClick}
                              >
                                {CommentIcons.CommentLikeIcon()}
                              </button>
                            )}
                          {!currentUser && (
                            <button
                              className="icon-con"
                              // data-articleid={currentDetailData._id}
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
                <img src={currentImage} alt="即時顯示上傳圖片" />
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
              onClick={handleCommentSubmit}
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
