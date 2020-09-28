import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";

import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollowers() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.get(
          `http://localhost:8080/profile/${username}/followers`,
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
  }, [username]);

  return isLoading ? (
    <LoadingDotsIcon />
  ) : (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img alt="" className="avatar-tiny" src={follower.avatar} />{" "}
            <strong>{follower.username}</strong>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowers;
