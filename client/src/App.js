import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import HeaderComponent from "./components/Header-component";
import HomeComponent from "./components/Home-component";
import LoginComponent from "./components/Login-component";
import PostArticleComponent from "./components/PostArticle-component";
function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let [currentData, setCurrentData] = useState([]); // 當前首頁fatch到的資料所有
  let [currentData2, setCurrentData2] = useState(); // 備用的allData(搜尋或是切換看板用的)
  let [currentSearch, setCurrentSearch] = useState(""); // 當前搜尋欄位內容
  let [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  let [boards, setBoards] = useState([
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
  ]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div>
      <HeaderComponent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        boards={boards}
        currentSearch={currentSearch}
        setCurrentSearch={setCurrentSearch}
        setMobileSidebarOpen={setMobileSidebarOpen}
        setCurrentData={setCurrentData}
        setCurrentData2={setCurrentData2}
      />
      <Switch>
        <Route path="/" exact>
          <HomeComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            boards={boards}
            currentSearch={currentSearch}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            currentData={currentData}
            setCurrentData={setCurrentData}
            currentData2={currentData2}
            setCurrentData2={setCurrentData2}
          />
        </Route>
        <Route path="/login" exact>
          <LoginComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="/postArticle" exact>
          <PostArticleComponent currentUser={currentUser} boards={boards} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
