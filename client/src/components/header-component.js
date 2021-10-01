import React from "react";
import { Link, useHistory } from "react-router-dom";
import NavigationIcons from "./icons/NavigationIcons";
import ocardLogo from "./images/Ocard.svg";
//import ham_menu from "./images/ham-menu.svg";

const HeaderComponent = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="ham_menu">{NavigationIcons.HamMenuIcon()}</div>
        <div className="logo">
          <Link to="/">
            <img src={ocardLogo} alt="Ocard Logo"></img>
          </Link>
        </div>
        <div className="search">
          <input placeholder="搜尋"></input>
          <button>{NavigationIcons.SearchIcon()}</button>
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
