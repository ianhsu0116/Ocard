import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArticleService from "../services/article.service";
import SidebarComponent from "./Sidebar-component";
import ArticleDetailComponent from "./ArticleDetail-component";
import GenderIcons from "./icons/GenderIcons";
import CommentIcons from "./icons/CommentIcons";
import mergeSortFormula from "./sortFormula/mergeSort-Formula";
import otherFormula from "./sortFormula/other-Formula";

const HomeComponent = (props) => {
  let {
    currentUser,
    boards,
    currentSearch,
    setCurrentSearch,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentData,
    setCurrentData,
    currentData2,
    setCurrentData2,
    // currentSidebarBoard,
    // setCurrentSidebarBoard,
  } = props;
  let [isInitRender, setIsIninRender] = useState(true);
  let [currentDetailData, setCurrentDetailData] = useState(null);
  let [articleDetailOpen, setArticleDetailOpen] = useState(false); // 文章內頁開啟狀態
  let [isSortConOpen, setIsSortConOpen] = useState(false); // 控制sortCon開關（電腦版）
  let [sortMethod, setSortMethod] = useState("熱門"); // 切換當前sort method
  let [windowWidth, setWindowWidth] = useState(window.window.innerWidth); // 即時獲取window width, 來做到sidebar開合控制
  window.addEventListener("resize", () => {
    setWindowWidth(window.window.innerWidth);
  });

  // 拿到當前網址列的params （ex. http://localhost7777/心情）
  let { boardPath } = useParams();

  // 進入網頁立即顯示文章
  useEffect(() => {
    ArticleService.get()
      .then((data) => {
        //console.log(data.data);

        // 先將順序排列成熱門優先，再放入currentData
        let sortedData = mergeSortFormula.hotMergeSort(data.data);
        // 備用data存放區, 用途：在點擊所有文章時 不用重新render資料 直接從備用的拿
        setCurrentData2(sortedData);

        if (data.data.length === 0) {
          window.alert("Ocard內還沒有任何文章歐，幫我新增一篇吧！");
        }

        // 判斷此次進來的網址是否有包含看板類別
        if (boardPath) {
          let boardData = otherFormula.boardSort(boardPath, sortedData);
          setCurrentData(boardData);

          //將當前看板設定到此網址列的看板(這樣sidebar才會有active效果)
          //setCurrentSidebarBoard(boardPath);
        } else {
          setCurrentData(sortedData);
        }

        //首次render後就設定成false
        setIsIninRender(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  // 搜尋功能
  useEffect(() => {
    //  判斷當前是否有搜尋條件
    if (currentSearch) {
      // 判斷現在是否有在看板分類中
      if (!boardPath) {
        // 先確認currentData2內是否有東西（防止還沒fatch到資料時，使用者先點擊換看板的按鈕）
        if (currentData2) {
          let searchData = otherFormula.searchSort(currentSearch, currentData2);
          //console.log(searchData);
          setCurrentData(searchData);

          if (searchData.length === 0) {
            window.alert("此看板沒有符合搜尋條件的文章喔！！");
          }
        }
      } else {
        // 先確認currentData2內是否有東西（防止還沒fatch到資料時，使用者先點擊換看板的按鈕）
        if (currentData) {
          let searchData = otherFormula.searchSortWithBoard(
            currentSearch,
            boardPath,
            currentData2
          );
          //console.log(searchData);
          setCurrentData(searchData);

          if (searchData.length === 0) {
            window.alert("此看板沒有符合搜尋條件的文章喔！！");
          }
        }
      }
    }
  }, [currentSearch]);

  // 切換板板時重新render頁面
  useEffect(() => {
    if (boardPath && !isInitRender) {
      // 先確認currentData2內是否有東西（防止還沒fatch到資料時，使用者先點擊換看板的按鈕）
      if (currentData2) {
        // 從currentData2中篩選出來，符合當前board的data
        let boardData = otherFormula.boardSort(boardPath, currentData2);

        //setCurrentSidebarBoard(boardPath);

        // 確認當前是哪個排列方式，排好再放入currentData
        if (sortMethod === "熱門") {
          let sortedData = mergeSortFormula.hotMergeSort(boardData);
          setCurrentData(sortedData);
        } else if (sortMethod === "最新") {
          let sortedData = mergeSortFormula.timeMergeSort(boardData);
          setCurrentData(sortedData);
        }
        if (boardData.length === 0) {
          window.alert("當前看板還沒有文章歐！");
        }
      }
    }
    // 清空當前Search，防止切換看板後搜尋內容相同時，因currentSearch內容沒變，無法觸發useEffect
    setCurrentSearch("");
  }, [boardPath]);

  // 顯示文章詳細內容
  function handleShowDetail(e) {
    // 開啟 ArticleDetail-component
    setArticleDetailOpen(true);

    // 使 body 無法滾動
    document.querySelector("body").classList.add("stopScroll");

    // 拿到當下點擊文章的文章id
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

  // 控制排序法容器開關（電腦版）
  const handleSortConOpen = (e) => {
    e.stopPropagation();
    if (isSortConOpen) {
      setIsSortConOpen(false);
    } else {
      setIsSortConOpen(true);
    }
  };

  // 點任一處即可關閉sortContainer（電腦版）
  window.addEventListener("click", () => {
    setIsSortConOpen(false);
  });

  // 即時更新演算法box內的文字（電腦版）
  const handledSortMethod = (e) => {
    setSortMethod(e.target.innerText);

    // 關閉sortContainer
    setIsSortConOpen(false);
  };

  // 當算法被更動後，即刻重新跑一次
  useEffect(() => {
    if (sortMethod === "熱門") {
      //console.log(currentData);
      let sortedData = mergeSortFormula.hotMergeSort(currentData);
      setCurrentData(sortedData);
    } else if (sortMethod === "最新") {
      //console.log(currentData);
      let sortedData = mergeSortFormula.timeMergeSort(currentData);
      setCurrentData(sortedData);
    }
  }, [sortMethod]);

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
          sortMethod={sortMethod}
          // currentSidebarBoard={currentSidebarBoard}
          // setCurrentSidebarBoard={setCurrentSidebarBoard}
          currentData2={currentData2}
          setCurrentData={setCurrentData}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          windowWidth={windowWidth}
        />
        <div className="main">
          <div className="main_nav">
            {/* 電腦版sort button */}
            <div className="middle">
              <div className="main_nav-middle-right">
                <span>文章排序依</span>
                <button onClick={handleSortConOpen}>
                  {sortMethod}
                  <img
                    className="main_nav-middle-right-downArrow"
                    src={require("./images/down.svg").default}
                    alt="downArror"
                  ></img>
                </button>
                {isSortConOpen && (
                  <div className="sortSelector-con">
                    <button className="hotSort" onClick={handledSortMethod}>
                      熱門
                    </button>
                    <button className="timeSort" onClick={handledSortMethod}>
                      最新
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* 手機版sort button */}
            <div className="main_nav-middle-mobile">
              <button
                className={sortMethod === "熱門" && "mobile-sortBtn-active"}
                onClick={handledSortMethod}
              >
                熱門
              </button>
              <button
                className={sortMethod === "最新" && "mobile-sortBtn-active"}
                onClick={handledSortMethod}
              >
                最新
              </button>
              <button className="followSort-mobile">追蹤</button>
            </div>
          </div>
          <div className="main_banner">
            <img src={require("./images/banner.png").default} alt="banner" />
          </div>
          {currentData &&
            currentData.map((data) => (
              <div
                key={data._id}
                className="article_con"
                onClick={handleShowDetail}
                data-articleid={data._id}
              >
                <div className="middle">
                  <div className="left">
                    <div className="top">
                      <div className="genderIcon">
                        {data.author.gender === "female" &&
                          GenderIcons.GirlIcon()}
                        {data.author.gender === "male" && GenderIcons.BoyIcon()}
                      </div>
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
