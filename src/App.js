import React, { useState } from "react";
import "./App.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import ExampleContext from "./ExampleContext";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function App() {
  const appToken = localStorage.getItem("appToken");
  const [loggedIn, setLoggedIn] = useState(Boolean(appToken));
  const [flashMessages, setFlashMessages] = useState([]);

  function addFlashMessage(msg) {
    setFlashMessages((prev) => prev.concat(msg));
  }

  return (
    <ExampleContext.Provider value={{ addFlashMessage, setLoggedIn }}>
      <BrowserRouter>
        <Header loggedIn={loggedIn} />
        <FlashMessages messages={flashMessages} />
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
          <Route path="/post/:id" exact>
            <ViewSinglePost />
          </Route>
        </Switch>

        <Footer />
      </BrowserRouter>
    </ExampleContext.Provider>
  );
}

export default App;
