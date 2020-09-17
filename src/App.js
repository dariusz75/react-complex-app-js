import React, { useState } from "react";
import "./App.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";

function App() {
  const appToken = localStorage.getItem("appToken");
  const [loggedIn, setLoggedIn] = useState(Boolean(appToken));
  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Switch>
        <Route path="/" exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/about-us">
          <About />
        </Route>
        <Route path="/terms" exact>
          <Terms />
        </Route>
        <Route path="/create-post" exact>
          <CreatePost />
        </Route>
      </Switch>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
