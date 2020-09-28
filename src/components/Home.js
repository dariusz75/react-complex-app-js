import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Axios from "axios";
import moment from "moment";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

function Home() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          "http://localhost:8080/getHomeFeed",
          {
            token: appState.user.token,
          },
          {
            cancelToken: cancelTokenRequest.token,
          }
        );
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
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

  const handleClose = (e) => {
    e.preventDefault();
    appDispatch({ type: "isSearchClose" });
  };

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your feed">
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}

      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">
            The latest posts from those you follow
          </h2>
          <div className="list-group">
            {state.feed.map((result, index) => {
              return (
                <Link
                  to={`/post/${result._id}`}
                  className="list-group-item list-group-item-action"
                  key={index}
                  onClick={handleClose}
                >
                  <img
                    alt=""
                    className="avatar-tiny"
                    src={result.author.avatar}
                  />{" "}
                  <strong>{result.title}</strong>
                  <span className="text-muted small">
                    {" "}
                    by {result.author.username} on{" "}
                    {moment(result.createdDate).format("L")}{" "}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </Page>
  );
}

export default Home;
