import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { useParams } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

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
        break;
      case "bodyChange":
        draft.body.value = action.value;
        break;
      case "saveChanges":
        draft.sendCount++;
        break;
      case "saveRequestStarted":
        draft.isSaving = true;
        break;
      case "saveRequestFinished":
        draft.isSaving = false;
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
        const response = await Axios.get(
          `http://localhost:8080/post/${state.id}`,
          {
            cancelToken: cancelTokenRequest.token,
          }
        );
        console.log("response from ViewSinglePost is: ", response.data);
        dispatch({ type: "fetchComplete", value: response.data });
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

  useEffect(() => {
    if (state.sendCount > 0) {
      dispatch({ type: "saveRequestStarted" });
      const cancelTokenRequest = Axios.CancelToken.source();
      async function fetchPost() {
        try {
          const response = await Axios.post(
            `http://localhost:8080/post/${state.id}/edit`,
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

  const handleBody = (e) => {
    dispatch({ type: "bodyChange", value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "saveChanges" });
  };

  return state.isFetching ? (
    <Page title="...">
      <LoadingDotsIcon />
    </Page>
  ) : (
    <Page title="Edit Post">
      <form onSubmit={handleSubmit}>
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
          />
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
          ></textarea>
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
