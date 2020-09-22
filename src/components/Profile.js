import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";

import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const initialProfileState = {
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: {
      postCount: "...",
      followerCount: "...",
      followingCount: "...",
    },
  };

  const appState = useContext(StateContext);
  const { username } = useParams();
  const [profileData, setProfileData] = useState(initialProfileState);

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `http://localhost:8080/profile/${username}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: cancelTokenRequest.token,
          }
        );
        setProfileData(response.data);
        console.log("The profile page response is: ", response.data);
      } catch (e) {
        console.log(
          "There was a problem or the request has been cancelled.",
          e
        );
      }
    }
    fetchData();
    return () => {
      cancelTokenRequest.cancel();
    };
  }, []);

  return (
    <Page title="Profile screen">
      <h2>
        <img alt="" className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <Link to="#" className="active nav-item nav-link">
          {`Posts: ${profileData.counts.postCount}`}
        </Link>
        <Link to="#" className="nav-item nav-link">
          {`Followers: ${profileData.counts.followerCount}`}
        </Link>
        <Link to="#" className="nav-item nav-link">
          {`Following: ${profileData.counts.followingCount}`}
        </Link>
      </div>

      <ProfilePosts />
    </Page>
  );
}

export default Profile;
