import React, { useState, useEffect } from "react";
import ArticleService from "../services/article.service";
import SidebarComponent from "./sidebar-component";
import ArticleDetailComponent from "./articleDetail-component";
import GenderIcons from "./icons/GenderIcons";
import CommentIcons from "./icons/CommentIcons";

const HomeComponent = (props) => {
  let { currentUser, setCurrentUser, boards } = props;
  let [currentData, setCurrentData] = useState([]); // 當前fatch到的資料
  let [currentDetailData, setCurrentDetailData] = useState(null);
  let [articleDetailOpen, setArticleDetailOpen] = useState(false); // 文章內頁開啟狀態

  // 進入網頁立即顯示文章
  useEffect(() => {
    ArticleService.get()
      .then((data) => {
        //console.log(data.data);
        setCurrentData(data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  // 顯示文章內容
  function handleShowDetail(e) {
    setArticleDetailOpen(true);
    let article_id = e.currentTarget.dataset.articleid;

    ArticleService.getById(article_id)
      .then((data) => {
        //console.log(data.data);
        setCurrentDetailData(data.data);
      })
      .catch((err) => {
        window.alert("發生錯誤，正在處理中！");
        //console.log(err);
      });
  }
  return (
    <div className="main-con">
      <div className="d-flex">
        {articleDetailOpen && (
          <ArticleDetailComponent
            currentUser={currentUser}
            setArticleDetailOpen={setArticleDetailOpen}
            currentDetailData={currentDetailData}
            setCurrentDetailData={setCurrentDetailData}
          />
        )}
        <SidebarComponent boards={boards} />
        <div className="main">
          <div className="main_nav">
            <div className="middle">
              <div className="right">
                <span>依文章排序</span>
                <button>熱門</button>
              </div>
            </div>
          </div>
          <div className="main_banner">
            <img src={require("./images/banner.png").default} alt="banner" />
          </div>
          {currentData &&
            currentData.map((data) => (
              <div
                className="article_con"
                onClick={handleShowDetail}
                data-articleid={data._id}
              >
                <div className="middle">
                  <div className="left">
                    <div className="top">
                      <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                      <div>{data.board} · </div>
                      <div>{data.author.email}</div>
                    </div>
                    <div className="mid">
                      <div className="article_title">{data.title}</div>
                      <div className="article_content">{data.content}</div>
                    </div>
                    <div className="bottom">
                      <div className="bottom-left">
                        <div className="icons">
                          <button>
                            <img
                              src={require("./images/like.png").default}
                              alt="like"
                            />
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
                        </div>
                        <div className="likeCount">{data.likes.length}</div>
                      </div>
                      <div className="bottom-right">
                        <button>{CommentIcons.CommentIcon()}</button>
                        <div className="commentCount">
                          {data.comment.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    {data.image.length > 0 && (
                      <div className="imgContainer">
                        <img src={data.image[0]} alt="article_img" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
