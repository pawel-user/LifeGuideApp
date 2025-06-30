import axios from "axios";

const port = 8080;
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${port}`;

export async function getUsers() {
  try {
    const response = await axios.get(API_URL + "/users");
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
}

export async function registerUser(newUserData) {
  try {
    const response = await axios.post(
      API_URL + "/register",
      newUserData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Registration error: ", error);
    throw error;
  }
}
