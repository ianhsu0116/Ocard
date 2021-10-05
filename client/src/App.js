import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import HeaderComponent from "./components/header-component";
import HomeComponent from "./components/home-component";
import LoginComponent from "./components/login-component";
import PostArticleComponent from "./components/postArticle-component";
function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
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
      />
      <Switch>
        <Route path="/" exact>
          <HomeComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            boards={boards}
          />
        </Route>
        <Route path="/login" exact>
          <LoginComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="/postArticle" exact>
          <PostArticleComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            boards={boards}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
