import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loggedUsers.js";
import PropTypes from "prop-types";

export default function Login({ setToken, setAlert, setContent }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, refreshToken } = await loginUser({ username, password }, setAlert);

      if (token && refreshToken) {
        setToken(token, refreshToken);
        setAlert("success", "Login Successful");
        setContent("home");
        navigate("/");
      } else {
        setAlert("error", "Login failed: missing token(s)");
      }
    } catch {
      // Obsługa błędów już w loginUser()
    }
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
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            <p>Password</p>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        <div className="button-container">
          <button type="submit" className="btn btn-dark">Submit</button>
          <button type="button" onClick={handleCancel} className="btn btn-outline-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
};
