import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import moment from "moment";

import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.get(
          `http://localhost:8080/profile/${username}/posts`,
          { cancelToken: cancelTokenRequest.token }
        );
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem! ", e);
      }
    }
    fetchData();
    return () => {
      cancelTokenRequest.cancel();
    };
  }, []);

  return isLoading ? (
    <LoadingDotsIcon />
  ) : (
    <div className="list-group">
      {posts.map((post) => {
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img alt="" className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>
            <span className="text-muted small">
              {" "}
              created on {moment(post.createdDate).format("L")}{" "}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
