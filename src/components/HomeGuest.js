import React, { useState } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

import Page from "./Page";

function HomeGuest() {
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
        break;
      case "usernameUniqueResults":
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        break;
      case "emailUniqueResults":
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        break;
      case "passwordAfterDelay":
        break;
      case "submitForm":
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(formReducer, initialState);

  function handleSubmit(e) {
    e.preventDefault();
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
