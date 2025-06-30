import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loggedUsers.js";
import propTypes from "prop-types";

export default function Login({ setToken, setLogin, setAlert, setContent }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser(
        {
          username,
          password,
        },
        setAlert
      );
      setToken(token);
      setLogin(true);
      setAlert("success", "Login Successful");
      setContent("home");
      navigate("/");
    } catch (error) {
    }
    return true;
  };

  const handleCancel = () => {
    setAlert("warning", "Action canceled");
    setContent("start");
    navigate("/");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In Panel</h2>
        <div className="form-group">
          <label>
            <p>Username</p>
            <input
              type="text"
              className="form-control"
              onChange={(event) => setUserName(event.target.value)}
              autoComplete="username"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <p>Password</p>
            <input
              type="password"
              className="form-control"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
        </div>
        <div className="button-container">
          <button type="submit" className="btn btn-dark">
            Submit
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: propTypes.func.isRequired,
  setLogin: propTypes.func.isRequired,
  setAlert: propTypes.func.isRequired,
};
