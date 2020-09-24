import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import StateContext from "../StateContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

function ViewSinglePost() {
  const appState = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  const { id } = useParams();

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/post/${id}`, {
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
  }, []);

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
          >
            <i className="fas fa-trash"></i>
          </Link>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
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

export default ViewSinglePost;
