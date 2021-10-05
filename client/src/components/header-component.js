import React from "react";
import { Link, useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";
import NavigationIcons from "./icons/NavigationIcons";
import ocardLogo from "./images/Ocard.svg";

const HeaderComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  const handlePost = () => {
    history.push("/postArticle");
  };
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功！ 現在導向登入頁面");
    setCurrentUser(null);
    history.push("/login");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="header-con">
      <header className="header">
        <div className="header-left">
          <div className="ham_menu">{NavigationIcons.HamMenuIcon()}</div>
          <div className="logo">
            <Link to="/" onClick={handleRefresh}>
              <img src={ocardLogo} alt="Ocard Logo"></img>
            </Link>
          </div>
          <div className="search">
            <input placeholder="搜尋"></input>
            <button>{NavigationIcons.SearchIcon()}</button>
          </div>
        </div>
        <div className="header-right">
          {!currentUser && (
            <Link to="/login">
              <span>註冊 | 登入</span>
            </Link>
          )}
          {currentUser && (
            <button onClick={handlePost} className="post-btn">
              {NavigationIcons.PostIcon()}
            </button>
          )}
          {currentUser && <button>{NavigationIcons.FriendIcon()}</button>}
          {currentUser && <button>{NavigationIcons.EmailBoxIcon()}</button>}
          {currentUser && (
            <button className="logout-btn" onClick={handleLogout}>
              {NavigationIcons.LogOutIcon()}
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
