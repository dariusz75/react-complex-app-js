import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";

function CreatePost(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title: title,
        body: body,
        token: appState.user.token,
      });
      appDispatch({
        type: "flashMessage",
        value: "Post successfully created!!!.",
      });

      // Redirect to the new post url
      props.history.push(`/post/${response.data}`);
    } catch (e) {
      console.log("There was an error", e);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleBody = (e) => {
    setBody(e.target.value);
  };

  return (
    <Page title="Create new post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={handleTitle}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={handleBody}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default withRouter(CreatePost);
