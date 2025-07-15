import axios from "axios";

const port = 8080;
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${port}`;

export async function loginUser(credentials, setAlert) {
  try {
    const response = await axios.post(
      API_URL + "/login",
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );

    // Sprawdź, czy backend zwraca oba tokeny
    const { token, refreshToken } = response.data;

    if (typeof token === "string" && typeof refreshToken === "string") {
      return { token, refreshToken };
    } else {
      throw new Error("Invalid login response: missing token(s)");
    }

  } catch (error) {
    console.error("Error logging in:", error);

    if (error.response && error.response.status === 400) {
      setAlert("error", "No saved users in the database. Register as first user.");
    } else if (error.response && error.response.status === 401) {
      setAlert("error", "Login Failed. Invalid credentials.");
    } else if (error.response && error.response.status === 500) {
      setAlert("error", "Login Failed. Internal Server Error.");
    } else {
      setAlert("error", "Login Failed. Please try again later.");
    }

    throw error;
  }
}

  export async function logoutUser(token) {
    if (!token) {
      throw new Error("No token, user is already logged out.");
    }
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while logging out:", error);
      throw error;
    }
  }
  
  