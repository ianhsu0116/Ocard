import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";
import ArticleService from "../services/article.service";
import mergeSortFormula from "./sortFormula/mergeSort-Formula";
import NavigationIcons from "./icons/NavigationIcons";
import ocardLogo from "./images/Ocard.svg";

const HeaderComponent = (props) => {
  let {
    currentUser,
    setCurrentUser,
    setCurrentSearch,
    setMobileSidebarOpen,
    setCurrentData,
    setCurrentData2,
    // setCurrentSidebarBoard,
  } = props;
  let [searchInput, setSearchInput] = useState("");
  const history = useHistory();

  // 發文頁面
  const handlePost = () => {
    history.push("/postArticle");
  };

  // 登出
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功！ 現在導向登入頁面");
    setCurrentUser(null);
    history.push("/login");
  };

  // 按下Ocard Logo 重新fetch data
  const handleRefresh = () => {
    // window.location.reload();
    history.push("/");
    ArticleService.get()
      .then((data) => {
        // 先將順序排列成熱門優先，再放入currentData
        let sortedData = mergeSortFormula.hotMergeSort(data.data);
        setCurrentData(sortedData);

        // 備用data存放區, 用途：在點擊所有文章時 不用重新render資料 直接從備用的拿
        setCurrentData2(sortedData);

        if (data.data.length === 0) {
          window.alert("Ocard內還沒有任何文章歐，幫我新增一篇吧！");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });

    // 按下logo等同於回到所有看板，故將當前所在看板位置回歸預設
    //setCurrentSidebarBoard("");
  };

  // 即時抓取search input value
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // 按下search button
  const handleSearchSubmit = (e) => {
    //console.log(searchInput);
    setCurrentSearch(searchInput);
    setSearchInput("");
  };

  // 按下漢堡（手機版的 Munu）
  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  // 按下profile
  const handleProfile = () => {
    history.push("/profile");
  };

  return (
    <div className="header-con">
      <header className="header">
        <div className="header-left">
          <div className="ham_menu" onClick={handleSidebarOpen}>
            {NavigationIcons.HamMenuIcon()}
          </div>
          <div className="logo">
            <div onClick={handleRefresh}>
              <img src={ocardLogo} alt="Ocard Logo"></img>
            </div>
          </div>
          <div className="search">
            <input
              placeholder="搜尋"
              onChange={handleSearchChange}
              value={searchInput}
            />
            <button onClick={handleSearchSubmit}>
              {NavigationIcons.SearchIcon()}
            </button>
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
            <button className="profile-btn" onClick={handleProfile}>
              {NavigationIcons.ProfileIcon()}
            </button>
          )}
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
