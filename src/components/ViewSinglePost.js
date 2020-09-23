import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import ReactMarkdown from "react-markdown";

import StateContext from "../StateContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ViewsinglePost() {
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

  return isLoading ? (
    <Page title="...">
      <LoadingDotsIcon />
    </Page>
  ) : (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </Link>
          <Link
            to="#"
            className="delete-post-button text-danger"
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </Link>
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

export default ViewsinglePost;
