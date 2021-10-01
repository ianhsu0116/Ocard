import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import HeaderComponent from "./components/header-component";
import HomeComponent from "./components/home-component";
import LoginComponent from "./components/login-component";
function App() {
  return (
    <div>
      <HeaderComponent />
      <Switch>
        <Route path="/" exact>
          <HomeComponent />
        </Route>
        <Route path="/login" exact>
          <LoginComponent />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
