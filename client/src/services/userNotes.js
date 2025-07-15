import axios from "axios";

const port = 8080;
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${port}`;

export async function getNotes(token) {
  try {
    const response = await axios.get(API_URL + "/user/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    return result || [];
  } catch (error) {
    console.error("Failed to make request:", error.message);
    return [];
  }
}

export async function addNote(newNote) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL + "/add/notes", newNote, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Adding new note error: ", error);
    throw error;
  }
}

export async function editNote(noteId, noteData) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/notes/${noteId}`, noteData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in editNote:", error);
    throw error;
  }
}

export async function deleteNote(noteId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteNote:", error);
    throw error;
  }
}
