import React, { useEffect, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

import DispatchContext from "../DispatchContext";

import Page from "./Page";

function HomeGuest() {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  };

  const formReducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 15) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can not exceed 15 characters.";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can only contain letters and numbers.";
        }
        break;
      case "usernameAfterDelay":
        if (draft.username.value.length < 5) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must be at least 5 characters.";
        }
        if (!draft.hasErrors) {
          draft.username.checkCount++;
        }
        break;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "The username already exists.";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "Please enter a valid email address.";
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++;
        }
        break;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "The email address already exists.";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 20) {
          draft.password.hasErrors = true;
          draft.password.message = "Password can not exceed 20 characters.";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 12 characters.";
        }

        break;
      case "submitForm":
        if (
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(formReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "usernameAfterDelay" });
      }, 1200);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailAfterDelay" });
      }, 1200);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordAfterDelay" });
      }, 1200);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const cancelRequest = Axios.CancelToken.source();
      async function fetchSearchResults() {
        try {
          const response = await Axios.post(
            "http://localhost:8080/doesUsernameExist",
            { username: state.username.value },
            { cancelToken: cancelRequest.token }
          );
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (e) {
          console.log("There was a problem or the request was cancelled. ", e);
        }
      }
      fetchSearchResults();

      return () => {
        cancelRequest.cancel();
      };
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const cancelRequest = Axios.CancelToken.source();
      async function fetchSearchResults() {
        try {
          const response = await Axios.post(
            "http://localhost:8080/doesEmailExist",
            { email: state.email.value },
            { cancelToken: cancelRequest.token }
          );
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          console.log("There was a problem or the request was cancelled. ", e);
        }
      }
      fetchSearchResults();

      return () => {
        cancelRequest.cancel();
      };
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      const cancelRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "http://localhost:8080/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: cancelRequest.token }
          );
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessage",
            value: "User was successfully created",
          });
          console.log("User was successfully created");
        } catch (e) {
          console.log("There was an error", e);
        }
      }
      fetchResults();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });

    // try {
    //   await Axios.post("http://localhost:8080/register", {
    //     username: username,
    //     email: email,
    //     password: password,
    //   });
    //   console.log("User was successfully created");
    // } catch (e) {
    //   console.log("There was an error", e);
    // }
    console.log(state);
  }

  const handleSetUsername = (e) => {
    const value = e.target.value;
    dispatch({ type: "usernameImmediately", value });
  };

  const handleSetEmail = (e) => {
    const value = e.target.value;
    dispatch({ type: "emailImmediately", value });
  };

  const handleSetPassword = (e) => {
    const value = e.target.value;
    dispatch({ type: "passwordImmediately", value });
  };
  return (
    <Page wide title="Welcome">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={handleSetUsername}
              />
              <CSSTransition
                classNames="liveValidateMessage"
                in={state.username.hasErrors}
                timeout={330}
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={handleSetEmail}
              />
              <CSSTransition
                classNames="liveValidateMessage"
                in={state.email.hasErrors}
                timeout={330}
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={handleSetPassword}
              />
              <CSSTransition
                classNames="liveValidateMessage"
                in={state.password.hasErrors}
                timeout={330}
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
