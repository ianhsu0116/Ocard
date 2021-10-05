import React from "react";
import { Link, useHistory } from "react-router-dom";
import ham_menu from "./images/ham-menu.svg";
import mouse from "./images/mouse.jpg";

const SidebarComponent = (props) => {
  let { boards } = props;
  const API_URL = "http://localhost:7777/api/article";

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
      <div className="boardSecond">
        <div>
          <span>Ocard 精選看板</span>
        </div>
      </div>

      {boards.map((board) => (
        <a>
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
