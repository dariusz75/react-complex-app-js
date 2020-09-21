import React, { useContext } from "react";
import { Link } from "react-router-dom";

import ExampleContext from "../ExampleContext";

function HeaderLoggedIn(props) {
  const { setLoggedIn } = useContext(ExampleContext);

  const handleLoggedOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("appToken");
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <Link to="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </Link>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to="#" className="mr-2">
        <img
          alt="avatar"
          className="small-header-avatar"
          src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
        />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button className="btn btn-sm btn-secondary" onClick={handleLoggedOut}>
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
