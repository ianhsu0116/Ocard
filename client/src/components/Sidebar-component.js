import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import mergeSortFormula from "./sortFormula/mergeSort-Formula";
import NavigationIcons from "./icons/NavigationIcons";
import CloseButtonIcon from "./icons/CloseButtonIcon";

const SidebarComponent = (props) => {
  let {
    boards,
    sortMethod,
    currentData2,
    setCurrentData,
    // currentSidebarBoard,
    // setCurrentSidebarBoard,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    windowWidth,
  } = props;

  // 拿到當前網址列的params （ex. http://localhost7777/心情）
  let { boardPath } = useParams();

  const handleBoardChange = (e) => {
    //console.log(e.currentTarget.dataset.board);
    // 更新當前看板
    //setCurrentSidebarBoard(e.currentTarget.dataset.board);

    // 如果是手機版的話選好看板後 關閉sidebar
    if (windowWidth <= 800) {
      setMobileSidebarOpen(false);
    }
  };

  // 回到所有看板
  const handleBackToAllBoard = () => {
    // 清空當前已選看板
    //setCurrentSidebarBoard("");

    // 先確認currentData2內是否有東西（防止還沒fatch到資料時，使用者先點擊換看板的按鈕）
    if (currentData2) {
      // 直接將備用的data render出來，直接減去拿資料的時間
      // 一樣要確認當前是哪個排列方式，排好再放入currentData
      if (sortMethod === "熱門") {
        setCurrentData(currentData2);
      } else if (sortMethod === "最新") {
        let sortedData = mergeSortFormula.timeMergeSort(currentData2);
        setCurrentData(sortedData);
      }
    }

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

      {boards.map((board, index) => (
        <Link
          to={`/${board}`}
          key={index}
          onClick={handleBoardChange}
          data-board={board}
          className={boardPath === board && "active"}
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
        </Link>
      ))}
    </div>
  );
};

export default SidebarComponent;
