import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";

import DispatchContext from "../DispatchContext";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const didMount = useRef(false);

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      if (didMount.current) {
        setState((draft) => {
          draft.requestCount++;
        });
      } else {
        didMount.current = true;
      }
    }, 3000);

    return () => {
      clearTimeout(delay);
    };
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      console.log("requestCount is: ", state.requestCount);
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
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> (3 items found)
              </div>
              <Link to="#" className="list-group-item list-group-item-action">
                <img
                  alt=""
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #1</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </Link>
              <Link to="#" className="list-group-item list-group-item-action">
                <img
                  alt=""
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                />{" "}
                <strong>Example Post #2</strong>
                <span className="text-muted small">
                  by barksalot on 2/10/2020{" "}
                </span>
              </Link>
              <Link to="#" className="list-group-item list-group-item-action">
                <img
                  alt=""
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #3</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
