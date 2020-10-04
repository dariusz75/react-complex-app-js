import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
import moment from "moment";

import DispatchContext from "../DispatchContext";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const didMount = useRef(false);

  const [state, setState] = useImmer({
    searchTerm: "",
    searchResults: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        if (didMount.current) {
          setState((draft) => {
            draft.requestCount++;
          });
        } else {
          didMount.current = true;
        }
      }, 1000);

      return () => {
        clearTimeout(delay);
      };
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const cancelRequest = Axios.CancelToken.source();
      async function fetchSearchResults() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: cancelRequest.token }
          );
          console.log("search response data is: ", response.data);
          setState((draft) => {
            draft.searchResults = response.data;
            draft.show = "results";
          });
          console.log("state.searchResults: ", state.searchResults);
        } catch (e) {
          console.log("There was a problem or the request was cancelled. ", e);
        }
      }
      fetchSearchResults();

      return () => {
        cancelRequest.cancel();
      };
    }
  }, [state.requestCount]);

  const handleClose = (e) => {
    e.preventDefault();
    appDispatch({ type: "isSearchClose" });
  };

  const handleInput = (e) => {
    const searchValue = e.target.value;
    setState((draft) => {
      draft.searchTerm = searchValue;
    });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span onClick={handleClose} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results:</strong> {state.searchResults.length}{" "}
                {state.searchResults.length > 1 ? "items " : "item "} found.
              </div>
              {state.searchResults.map((result, index) => {
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
