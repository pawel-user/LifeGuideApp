import api from "./axiosConfig.js";

const port = 8080;
const API_URL = import.meta.env.VITE_API_URL || `http://localhost:${port}`;

export async function getNotes(token) {
  try {
    const response = await api.get(API_URL + "/user/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data.map((note) => ({
      id: note.id,
      noteTitle: note.notetitle, 
      description: note.description,
    }));

    return result || [];
  } catch (error) {
    console.error("Failed to make request:", error.message);
    return [];
  }
}

export async function addNote(newNote) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(API_URL + "/add/notes", newNote, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: response.data.id,
      noteTitle: newNote.noteTitle ?? newNote.notetitle,
      description: newNote.description,
    };
  } catch (error) {
    console.error("Adding new note error: ", error);
    throw error;
  }
}

export async function editNote(noteId, noteData) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.patch(`${API_URL}/notes/${noteId}`, noteData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const mapped = response.data;
    return {
      id: mapped.id,
      noteTitle: mapped.notetitle,
      description: mapped.description,
    };
  } catch (error) {
    console.error("Error in editNote:", error);
    throw error;
  }
}

export async function deleteNote(noteId) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`${API_URL}/notes/${noteId}`, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const deleted = response.data.deletedNote;
    return {
      id: deleted.id,
      noteTitle: deleted.notetitle,
      description: deleted.description,
    };
  } catch (error) {
    console.error("Error in deleteNote:", error);
    throw error;
  }
}
