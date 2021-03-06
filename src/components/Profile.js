import React, { useEffect, useContext } from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { useImmer } from "use-immer";

import StateContext from "../StateContext";

import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

function Profile() {
  const initialProfileState = {
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: {
        postCount: "...",
        followerCount: "...",
        followingCount: "...",
      },
    },
  };

  const appState = useContext(StateContext);
  const { username } = useParams();
  const [state, setState] = useImmer(initialProfileState);

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
        setState((draft) => {
          draft.profileData = response.data;
        });
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
  }, [username]);

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `http://localhost:8080/addFollow/${state.profileData.profileUsername}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: cancelTokenRequest.token,
          }
        );
        setState((draft) => {
          draft.profileData.isFollowing = true;
          draft.profileData.counts.followerCount++;
          draft.followActionLoading = false;
        });
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
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `http://localhost:8080/addFollow/${state.profileData.profileUsername}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: cancelTokenRequest.token,
          }
        );
        setState((draft) => {
          draft.profileData.isFollowing = false;
          draft.profileData.counts.followerCount--;
          draft.followActionLoading = false;
        });
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
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  };

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  };

  return (
    <Page title="Profile screen">
      <h2>
        <img
          alt=""
          className="avatar-small"
          src={state.profileData.profileAvatar}
        />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          appState.user.username !== "..." && (
            <button
              className="btn btn-primary btn-sm ml-2"
              onClick={startFollowing}
              disabled={state.followActionLoading}
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}{" "}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          appState.user.username !== "..." && (
            <button
              className="btn btn-danger btn-sm ml-2"
              onClick={stopFollowing}
              disabled={state.followActionLoading}
            >
              Unfollow <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className=" nav-item nav-link"
        >
          {`Posts: ${state.profileData.counts.postCount}`}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className=" nav-item nav-link"
        >
          {`Followers: ${state.profileData.counts.followerCount}`}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className=" nav-item nav-link"
        >
          {`Following: ${state.profileData.counts.followingCount}`}
        </NavLink>
      </div>
      <Switch>
        <Route exact path={`/profile/:username`}>
          <ProfilePosts />
        </Route>
        <Route path={`/profile/:username/followers`}>
          <ProfileFollowers />
        </Route>
        <Route path={`/profile/:username/following`}>
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  );
}

export default Profile;
