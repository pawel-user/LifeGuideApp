import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/registeredUsers.js";

export default function Register(props) {
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
    repeatedPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(userInput);
      if (response) {
        props.setAlert("success", "Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.status === 409) {
        props.setAlert(
          "error",
          "This user already exists! Try login or enter other data to register"
        );
      } else if (
        error.status === 400 &&
        error.response.data === "All fields are required"
      ) {
        props.setAlert(
          "error",
          "Empty fields detected! All input fields are required."
        );
      } else if (
        error.status === 400 &&
        error.response.data === "Invalid email format"
      ) {
        props.setAlert("error", "Invalid email format! Please try again.");
      } else if (
        error.status === 400 &&
        error.response.data === "User credentials failed"
      ) {
        props.setAlert(
          "error",
          "Registration Failed. The user credentials are not the same! Please try again."
        );
      }
    }
  };

  const clearInputs = (e) => {
    e.preventDefault();
    setUserInput({
      username: "",
      email: "",
      password: "",
      repeatedPassword: "",
    });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up Panel</h2>
        <div className="form-group">
          <label>
            <p>Username</p>
            <input
              type="text"
              className="form-control"
              onChange={handleChange}
              value={userInput.username}
              name="username"
              autoComplete="username"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <p>Email address</p>
            <input
              type="email"
              className="form-control"
              onChange={handleChange}
              value={userInput.email}
              name="email"
              autoComplete="email"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <p>Password</p>
            <input
              type="password"
              className="form-control"
              onChange={handleChange}
              value={userInput.password}
              name="password"
              autoComplete="new-password"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <p>Password repeat</p>
            <input
              type="password"
              className="form-control"
              onChange={handleChange}
              value={userInput.repeatedPassword}
              name="repeatedPassword"
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="button-container">
          <button type="submit" className="btn btn-dark">
            Sign up
          </button>
          <button
            onClick={clearInputs}
            className="btn btn-outline-secondary clear-button"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
