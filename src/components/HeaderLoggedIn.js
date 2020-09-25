import React, { useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleLoggedOut = () => {
    appDispatch({ type: "logout" });
    props.history.push("/");
  };

  const handleOpenSearch = (e) => {
    e.preventDefault();
    appDispatch({ type: "isSearchOpen" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <Link
        onClick={handleOpenSearch}
        to="#"
        className="text-white mr-2 header-search-icon pr-1"
        data-tip="Search post"
        data-for="search-tooltip"
      >
        <i className="fas fa-search"></i>
      </Link>
      <ReactTooltip id="search-tooltip" className="custom-tooltip" />
      <span
        className="mr-2 header-chat-icon text-white pr-1"
        data-tip="Chat"
        data-for="chat"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip id="chat" className="custom-tooltip" />
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-tip="My profile"
        data-for="user-profile"
      >
        <img
          alt="avatar"
          className="small-header-avatar"
          src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
        />
      </Link>
      <ReactTooltip id="user-profile" className="custom-tooltip" />
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button className="btn btn-sm btn-secondary" onClick={handleLoggedOut}>
        Sign Out
      </button>
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
