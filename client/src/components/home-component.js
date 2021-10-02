import React from "react";
import SidebarComponent from "./sidebar-component";
import HotSortIcon from "./icons/HotSortIcon";
import GenderIcons from "./icons/GenderIcons";

const HomeComponent = () => {
  return (
    <div className="d-flex">
      <SidebarComponent />
      <div className="main">
        <div className="main_nav">
          <div className="middle">
            <div className="right">
              <span>依文章排序</span>
              <button>熱門</button>
            </div>
          </div>
        </div>
        <div className="main_banner">
          <img src={require("./images/banner.png").default} alt="banner" />
        </div>
        <div className="article_con">
          <div className="middle">
            <div className="left">
              <div className="top">
                <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                <div>有趣 · </div>
                <div>ianian880116@fake.com</div>
              </div>
              <div className="mid">
                <div className="article_title">小豬豬起床囉！</div>
                <div className="article_content">
                  小豬豬起床囉！小豬豬起床囉！ 小豬豬起床囉！ 小豬豬起床囉！
                  小豬豬起床囉！
                  小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！
                </div>
              </div>
              <div className="bottom"></div>
            </div>
            <div className="right">
              <div className="imgContainer">
                <img
                  src={require("./images/banner.png").default}
                  alt="article_img"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="article_con">
          <div className="middle">
            <div className="left">
              <div className="top">
                <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                <div>有趣 · </div>
                <div>ianian880116@fake.com</div>
              </div>
              <div className="mid">
                <div className="article_title">小豬豬起床囉！</div>
                <div className="article_content">
                  小豬豬起床囉！小豬豬起床囉！ 小豬豬起床囉！ 小豬豬起床囉！
                  小豬豬起床囉！
                  小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！
                </div>
              </div>
              <div className="bottom"></div>
            </div>
            <div className="right">
              <div className="imgContainer">
                <img
                  src={require("./images/banner.png").default}
                  alt="article_img"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="article_con">
          <div className="middle">
            <div className="left">
              <div className="top">
                <div className="genderIcon">{GenderIcons.GirlIcon()}</div>
                <div>有趣 · </div>
                <div>ianian880116@fake.com</div>
              </div>
              <div className="mid">
                <div className="article_title">小豬豬起床囉！</div>
                <div className="article_content">
                  小豬豬起床囉！小豬豬起床囉！ 小豬豬起床囉！ 小豬豬起床囉！
                  小豬豬起床囉！
                  小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！小豬豬起床囉！
                </div>
              </div>
              <div className="bottom"></div>
            </div>
            <div className="right">
              <div className="imgContainer">
                <img
                  src={require("./images/banner.png").default}
                  alt="article_img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
