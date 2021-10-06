import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ArticleService from "../services/article.service";

const SidebarComponent = (props) => {
  let { boards, currentSidebarBoard, setCurrentSidebarBoard, setCurrentData } =
    props;

  const handleBoardChange = (e) => {
    //console.log(e.currentTarget.dataset.board);
    setCurrentSidebarBoard(e.currentTarget.dataset.board);
  };

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

  return (
    <div className="sidebar">
      <Link to="/" onClick={handleBackToAllBoard}>
        <div>
          <div className="board-icon-con">
            <img
              src={require("./images/ham-menu.svg").default}
              alt="ham_menu "
            />
          </div>
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
