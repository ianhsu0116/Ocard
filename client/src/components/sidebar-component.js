import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ArticleService from "../services/article.service";
import NavigationIcons from "./icons/NavigationIcons";
import CloseButtonIcon from "./icons/CloseButtonIcon";

const SidebarComponent = (props) => {
  let {
    boards,
    currentSidebarBoard,
    setCurrentSidebarBoard,
    setCurrentData,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = props;

  const handleBoardChange = (e) => {
    //console.log(e.currentTarget.dataset.board);
    setCurrentSidebarBoard(e.currentTarget.dataset.board);
  };
  // useEffect(() => {
  //   console.log(currentSidebarBoard);
  // }, [currentSidebarBoard]);

  // 回到所有看板
  const handleBackToAllBoard = () => {
    setCurrentSidebarBoard("");
    ArticleService.get()
      .then((data) => {
        //console.log(data.data);
        setCurrentData(data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleSidebarOpen = () => {
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    let sidebar = document.querySelector(".sidebar");
    console.log(sidebar);
    if (mobileSidebarOpen) {
      sidebar.style.display = "flex";
    } else {
      sidebar.style.display = "none";
    }
  }, [mobileSidebarOpen]);

  ///// ====================== 以下尚未完成，正在實現即時獲取window width, 來做到sidebar開合控制
  let windowWidth = 1080;
  window.addEventListener("resize", (e) => {
    windowWidth = window.window.innerWidth;
  });
  useEffect(() => {}, []);

  return (
    <div className="sidebar">
      <div className="sidbar-header">
        精選看板
        <div onClick={handleSidebarOpen} className="sidebar-close-btn-con">
          {CloseButtonIcon()}
        </div>
      </div>
      <Link to="/" onClick={handleBackToAllBoard}>
        <div>
          <div className="board-icon-con">{NavigationIcons.BookMarkIcon()}</div>
          <span>所有看板</span>
        </div>
      </Link>
      <div className="boardSecond">
        <div>
          <span>Ocard 精選看板</span>
        </div>
      </div>

      {boards.map((board) => (
        <a
          onClick={handleBoardChange}
          data-board={board}
          className={currentSidebarBoard == board && "active"}
        >
          <div>
            <div className="board-icon-con2">
              <img
                src={require(`./images/${board}.jpeg`).default}
                alt={board}
              />
            </div>
            <span>{board}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SidebarComponent;
