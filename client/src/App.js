import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import HeaderComponent from "./components/header-component";
import HomeComponent from "./components/home-component";
function App() {
  return (
    <div>
      <HeaderComponent />
      <Switch>
        <Route path="/" exact>
          <HomeComponent />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
