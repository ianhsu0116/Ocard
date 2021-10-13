import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationIcons from "./icons/NavigationIcons";
import CloseButtonIcon from "./icons/CloseButtonIcon";

const SidebarComponent = (props) => {
  let {
    boards,
    currentSidebarBoard,
    setCurrentSidebarBoard,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    windowWidth,
  } = props;

  const handleBoardChange = (e) => {
    //console.log(e.currentTarget.dataset.board);
    // 更新當前看板
    setCurrentSidebarBoard(e.currentTarget.dataset.board);

    // 如果是手機版的話選好看板後 關閉sidebar
    if (windowWidth <= 800) {
      setMobileSidebarOpen(false);
    }
  };

  // 回到所有看板
  const handleBackToAllBoard = () => {
    // 清空當前已選看板
    setCurrentSidebarBoard("");

    // 選好看板後 如果是手機版的話 => 關閉sidebar
    if (windowWidth <= 800) {
      setMobileSidebarOpen(false);
    }
  };

  // 按下看板關閉按鈕
  const handleSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  // 控制手機版的sidebar開關
  useEffect(() => {
    let sidebar = document.querySelector(".sidebar");
    //console.log(sidebar);

    if (mobileSidebarOpen) {
      sidebar.style.display = "flex";
    } else {
      sidebar.style.display = "none";
    }
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (windowWidth > 800) {
      setMobileSidebarOpen(true);
    } else {
      setMobileSidebarOpen(false);
    }
  }, [windowWidth]);

  return (
    <div className="sidebar">
      <div className="sidbar-header">
        精選看板
        <div onClick={handleSidebarClose} className="sidebar-close-btn-con">
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
