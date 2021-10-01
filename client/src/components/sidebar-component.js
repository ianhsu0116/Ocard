import React from "react";
import { Link, useHistory } from "react-router-dom";
import ham_menu from "./images/ham-menu.svg";
import mouse from "./images/mouse.jpg";

const SidebarComponent = () => {
  let boards = [
    "NBA",
    "健身",
    "外送",
    "居家",
    "心情",
    "感情",
    "星座",
    "時事",
    "有趣",
    "梗圖",
    "烹飪",
    "理財",
    "穿搭",
    "網購",
    "西斯",
  ];

  return (
    <div className="sidebar">
      <a>
        <div>
          <div className="board-icon-con">
            <img src={ham_menu} alt="ham_menu " />
          </div>
          <span>所有看板</span>
        </div>
      </a>
      <a>
        <div>
          <span className="boardSecond">Ocard 精選看板</span>
        </div>
      </a>

      {boards.map((board) => (
        <a>
          <div>
            <div className="board-icon-con2">
              <img src={mouse} alt={board} />
            </div>
            <span>{board}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SidebarComponent;
