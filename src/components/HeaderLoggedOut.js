import React, { useState, useContext } from "react";
import Axios from "axios";

import DispatchContext from "../DispatchContext";

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSetUsername = (e) => {
    setUsername(e.target.value);
    console.log(username);
  };

  const handleSetPassword = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
      } else {
        console.log("Incorrect username or password");
      }
    } catch (e) {
      console.log("There was an error");
    }
  };

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleOnSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={handleSetUsername}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={handleSetPassword}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm" type="submit">
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
