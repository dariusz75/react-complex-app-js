import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";

import Page from "./Page";

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
    async function fetchData() {
      try {
        const response = await Axios.post(
          `http://localhost:8080/profile/${username}`,
          {
            token: appState.user.token,
          }
        );
        setProfileData(response.data);
        console.log("The profile response is: ", response.data);
      } catch (e) {
        console.log("Ther was a problem!", e);
      }
    }
    fetchData();
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

      <div className="list-group">
        <Link to="#" className="list-group-item list-group-item-action">
          <img
            alt=""
            className="avatar-tiny"
            src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
          />{" "}
          <strong>Example Post #1</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          <img
            alt=""
            className="avatar-tiny"
            src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
          />{" "}
          <strong>Example Post #2</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          <img
            alt=""
            className="avatar-tiny"
            src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
          />{" "}
          <strong>Example Post #3</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </Link>
      </div>
    </Page>
  );
}

export default Profile;
