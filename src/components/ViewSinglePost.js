import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, withRouter } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

function ViewSinglePost(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  const { id } = useParams();

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: cancelTokenRequest.token,
        });
        console.log("response from ViewSinglePost is: ", response.data);
        setPost(response.data);
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
  }, [id]);

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    } else {
      return false;
    }
  }

  async function handleDelete() {
    const areYouSure = window.confirm(
      "are you sure you want to delete this post?"
    );
    if (areYouSure) {
      try {
        const response = await Axios({
          url: `/post/${id}`,
          data: {
            token: appState.user.token,
          },
          method: "delete",
        });
        if (response.data === "Success") {
          // 1. display a flash message
          appDispatch({
            type: "flashMessage",
            value: "Post was successfully deleted.",
          });

          // 2. redirect back to the current user's profile
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log("There was a problem with deleting a post: ", e);
      }
    }
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  if (!isLoading && !post) {
    return <NotFound />;
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              className="text-primary mr-2"
              data-tip="Edit"
              data-for="edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <Link
              to="#"
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${appState.user.username}`}>
          <img alt="" className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${appState.user.username}`}>
          {post.author.username}
        </Link>{" "}
        on {moment(post.createdDate).format("L")}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  );
}

export default withRouter(ViewSinglePost);
