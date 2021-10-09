import React, { useState, useEffect } from "react";
import ArticleService from "../services/article.service";
import SidebarComponent from "./sidebar-component";
import ArticleDetailComponent from "./articleDetail-component";
import GenderIcons from "./icons/GenderIcons";
import CommentIcons from "./icons/CommentIcons";
import mergeSortFormula from "./sortFormula/mergeSort-Formula";

const HomeComponent = (props) => {
  let {
    currentUser,
    boards,
    currentSearch,
    setCurrentSearch,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = props;
  let [currentData, setCurrentData] = useState([]); // 當前首頁fatch到的資料所有
  let [currentDetailData, setCurrentDetailData] = useState(null);
  let [articleDetailOpen, setArticleDetailOpen] = useState(false); // 文章內頁開啟狀態
  let [currentSidebarBoard, setCurrentSidebarBoard] = useState(""); // 當前在哪個看板

  // 進入網頁立即顯示文章
  useEffect(() => {
    ArticleService.get()
      .then((data) => {
        //console.log(data.data);
        setCurrentData(data.data);
        if (data.data.length === 0) {
          window.alert("Ocard內還沒有任何文章歐，幫我新增一篇吧！");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    //  判斷當前是否有搜尋條件
    if (currentSearch) {
      // 判斷現在是否有在看板分類中
      if (!currentSidebarBoard) {
        ArticleService.getBySearch(currentSearch)
          .then((data) => {
            //console.log(data.data);
            setCurrentData(data.data);
            setCurrentSearch(""); // 搜尋完後就清空當前搜尋條件
            if (data.data.length === 0) {
              window.alert("沒有相符的文章喔！！");
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        ArticleService.getBySearch(currentSearch, currentSidebarBoard)
          .then((data) => {
            //console.log(data.data);
            setCurrentData(data.data);
            setCurrentSearch(""); // 搜尋完後就清空當前搜尋條件
            if (data.data.length === 0) {
              window.alert("此看板沒有相符的文章喔！！");
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
  }, [currentSearch]);

  // 切換板板時重新render頁面
  useEffect(() => {
    if (currentSidebarBoard) {
      ArticleService.getByBoard(currentSidebarBoard)
        .then((data) => {
          //console.log(data.data);
          setCurrentData(data.data);
          if (data.data.length === 0) {
            window.alert("當前看板還沒有文章歐！");
          }
        })
        .catch((err) => {
          console.log(err.response);
          console.log(1);
        });
    } else {
      ArticleService.get()
        .then((data) => {
          //console.log(data.data);
          setCurrentData(data.data);
        })
        .catch((err) => {
          console.log(err.response);
          console.log(2);
        });
    }
  }, [currentSidebarBoard]);

  // 顯示文章詳細內容
  function handleShowDetail(e) {
    setArticleDetailOpen(true);
    let article_id = e.currentTarget.dataset.articleid;

    ArticleService.getById(article_id)
      .then((data) => {
        //console.log(data.data);
        setCurrentDetailData(data.data);
      })
      .catch((err) => {
        window.alert("發生錯誤，正在處理中！(get articleDetail)");
        //console.log(err);
        //console.log(err.response);
      });
  }

  // =========目前停在這，無法順利控制container的開合=================
  // 控制排序法容器開關
  let [isSortConOpen, setIsSortConOpen] = useState("none");
  const handleSortConOpen = () => {
    setIsSortConOpen("flex");
  };
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
        <SidebarComponent
          boards={boards}
          currentSidebarBoard={currentSidebarBoard}
          setCurrentSidebarBoard={setCurrentSidebarBoard}
          currentData={currentData}
          setCurrentData={setCurrentData}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <div className="main">
          <div className="main_nav">
            <div className="middle">
              <div className="main_nav-middle-right">
                <span>文章排序依</span>
                <button onClick={handleSortConOpen}>熱門</button>
                <div className="sortSelector-con" display={isSortConOpen}>
                  <button className="hotSort">熱門</button>
                  <button className="timeSort">最新</button>
                </div>
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
