import React from "react";
import { Link, useHistory } from "react-router-dom";
import ocardLogo from "./images/Ocard.svg";
import ham_menu from "./images/ham-menu.svg";

const HeaderComponent = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="ham_menu">
          <img src={ham_menu} alt="ham_menu "></img>
        </div>
        <div className="logo">
          <Link to="/">
            <img src={ocardLogo} alt="Ocard Logo"></img>
          </Link>
        </div>
        <div className="search">
          <input placeholder="搜尋"></input>
          <button>搜尋</button>
        </div>
      </div>
      <div className="header-right">
        <Link to="/login">
          <span>註冊 | 登入</span>
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;
