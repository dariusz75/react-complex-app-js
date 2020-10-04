import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const editPostReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        break;
      case "titleChange":
        draft.title.value = action.value;
        draft.title.hasError = false;
        break;
      case "bodyChange":
        draft.body.value = action.value;
        draft.body.hasError = false;
        break;
      case "saveChanges":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }

        break;
      case "saveRequestStarted":
        draft.isSaving = true;
        break;
      case "saveRequestFinished":
        draft.isSaving = false;
        break;
      case "titleBlur":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "Please provide a title";
        }
        break;
      case "bodyBlur":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "Please provide a content";
        }
        break;
      case "notFound":
        draft.notFound = true;
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(editPostReducer, initialState);

  useEffect(() => {
    const cancelTokenRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: cancelTokenRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
        } else {
          dispatch({ type: "notFound" });
        }
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

  useEffect(() => {
    if (state.sendCount > 0) {
      dispatch({ type: "saveRequestStarted" });
      const cancelTokenRequest = Axios.CancelToken.source();
      async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: cancelTokenRequest.token,
            }
          );
          dispatch({ type: "fetchComplete", value: response.data });
          appDispatch({
            type: "flashMessage",
            value: "Post successfully edited!!!.",
          });
          dispatch({ type: "saveRequestFinished" });
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
    }
  }, [state.sendCount]);

  const handleTitle = (e) => {
    dispatch({ type: "titleChange", value: e.target.value });
  };

  const handleTitleBlur = (e) => {
    dispatch({ type: "titleBlur", value: e.target.value });
  };

  const handleBody = (e) => {
    dispatch({ type: "bodyChange", value: e.target.value });
  };

  const handleBodyBlur = (e) => {
    dispatch({ type: "bodyBlur", value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleBlur", value: state.title.value });
    dispatch({ type: "bodyBlur", value: state.body.value });
    dispatch({ type: "saveChanges" });
  };

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  if (state.notFound) {
    return <NotFound />;
  }

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={handleTitle}
            onBlur={handleTitleBlur}
          />
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={handleBody}
            onBlur={handleBodyBlur}
          ></textarea>
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
