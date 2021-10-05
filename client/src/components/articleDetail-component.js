import React, { useState, useEffect } from "react";
import ArticleService from "../services/article.service";
import GenderIcons from "./icons/GenderIcons";
import CommentIcons from "./icons/CommentIcons";
import CloseButtonIcon from "./icons/CloseButtonIcon";
import UploadImgIcon from "./icons/UploadImgIcon";

const ArticleDetailComponent = (prop) => {
  let { setArticleDetailOpen, currentDetailData, setCurrentDetailData } = prop;
  const handleClose = () => {
    setArticleDetailOpen(false);
    setCurrentDetailData(null);
  };
  const handleFileChange = (e) => {
    console.log("Good");
  };
  const handleSubmit = (e) => {
    console.log("sub");
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
                <div className="articleDetail-comment-con">
                  <div className="articleDetail-comment-left">
                    <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                  </div>
                  <div className="articleDetail-comment-mid">
                    <div className="articleDetail-comment-mid-title">
                      <div className="email">ian@fake.com</div>
                      <div className="time-floor">
                        <span className="floor">B1</span>
                        <span> · </span>
                        <span className="time">2021/6/25 下午2:31:56</span>
                      </div>
                    </div>
                    <div className="articleDetail-comment-mid-text">
                      西堤牛排」首推菲力牛排美式餐盒，標榜大份量口感紮實鮮美牛肉，搭配清炒季節鮮蔬，主餐更有蒜香貝果，
                    </div>
                  </div>
                  <div className="articleDetail-comment-right">
                    <div className="articleDetail-comment-right-likes">
                      <button className="icon-con">
                        {CommentIcons.CommentLikeIcon()}
                      </button>
                      <div className="likeCount">1</div>
                    </div>
                  </div>
                </div>

                <div className="articleDetail-comment-con">
                  <div className="articleDetail-comment-left">
                    <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                  </div>
                  <div className="articleDetail-comment-mid">
                    <div className="articleDetail-comment-mid-title">
                      <div className="email">ian@fake.com</div>
                      <div className="time-floor">
                        <span className="floor">B1</span>
                        <span> · </span>
                        <span className="time">2021/6/25 下午2:31:56</span>
                      </div>
                    </div>
                    <div className="articleDetail-comment-mid-text">
                      西堤牛排」首推菲力牛排美式餐盒，標榜大份量口感紮實鮮美牛肉，搭配清炒季節鮮蔬，主餐更有蒜香貝果，
                    </div>
                  </div>
                  <div className="articleDetail-comment-right">
                    <div className="articleDetail-comment-right-likes">
                      <button className="icon-con">
                        {CommentIcons.CommentLikeIcon()}
                      </button>
                      <div className="likeCount">1</div>
                    </div>
                  </div>
                </div>

                <div className="articleDetail-comment-con">
                  <div className="articleDetail-comment-left">
                    <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                  </div>
                  <div className="articleDetail-comment-mid">
                    <div className="articleDetail-comment-mid-title">
                      <div className="email">ian@fake.com</div>
                      <div className="time-floor">
                        <span className="floor">B1</span>
                        <span> · </span>
                        <span className="time">2021/6/25 下午2:31:56</span>
                      </div>
                    </div>
                    <div className="articleDetail-comment-mid-text">
                      西堤牛排」首推菲力牛排美式餐盒，標榜大份量口感紮實鮮美牛肉，搭配清炒季節鮮蔬，主餐更有蒜香貝果，
                    </div>
                    <div className="articleDetail-comment-mid-img">
                      <img src={require("./images/mouse.jpg").default} />
                    </div>
                  </div>
                  <div className="articleDetail-comment-right">
                    <div className="articleDetail-comment-right-likes">
                      <button className="icon-con">
                        {CommentIcons.CommentLikeIcon()}
                      </button>
                      <div className="likeCount">1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="articleDetail-comment-input">
            <textarea placeholder="回應前請詳閱全站站規和本板板規。"></textarea>
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
              className="disabled"
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
