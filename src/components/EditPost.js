import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import moment from "moment";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

function EditPost(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const { id } = useParams();

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/post/${id}`, {
          cancelToken: cancelTokenRequest.token,
        });
        console.log("response from ViewSinglePost is: ", response.data);
        setTitle(response.data.title);
        setBody(response.data.body);
        setIsLoading(false);
        console.log("The posts page response is: ", response.data);
      } catch (e) {
        console.log(
          "There was a problem or the request has been cancelled.",
          e
        );
      }
    }
    fetchPost();
    return () => {
      cancelTokenRequest.cancel();
    };
  }, []);

  const handleEditTitle = (e) => {
    setTitle(e.target.value);
    console.log("title is: ", title);
  };

  const handleEditBody = (e) => {
    setBody(e.target.value);
    console.log("body is: ", body);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await Axios.post(`http://localhost:8080/post/${id}/edit`, {
        title: title,
        body: body,
        token: appState.user.token,
      });
      appDispatch({
        type: "flashMessage",
        value: "Post successfully edited!!!.",
      });

      // Redirect to the new post url
      props.history.push(`/post/${id}`);
    } catch (e) {
      console.log("There was an error");
    }
  };

  return isLoading ? (
    <Page title="...">
      <LoadingDotsIcon />
    </Page>
  ) : (
    <Page title="Edit post">
      <form onSubmit={handleSaveChanges}>
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
            defaultValue={title}
            onChange={handleEditTitle}
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
            defaultValue={body}
            onChange={handleEditBody}
          />
        </div>

        <button className="btn btn-primary">Save Changes</button>
      </form>
    </Page>
  );
}

export default EditPost;
