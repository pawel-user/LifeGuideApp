import React from "react";
import { deleteNote } from "../services/userNotes.js";
import { DeleteButton, CancelButton } from "../styles/styledButtons.js";

function DeleteNote({ note, onRemove, setAlert, cancelAction }) {
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await deleteNote(note.id);

      if (response?.status === 404) {
        setAlert("error", "Note not found.");
        return;
      }

      onRemove(note.id);
      setAlert("success", `Note with ID ${note.id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting note:", error);
      setAlert("error", "Deletion failed. Please try again.");
    }
  }

  function handleCancel(event) {
    event.preventDefault();
    setAlert("info", "Deletion canceled.");
    cancelAction();
  }

  return (
    <div className="delete-container">
      <form className="create-note" onSubmit={handleSubmit}>
        <h2>Delete User Note</h2>
        <p className="form-question">Are you sure you want to delete this note?</p>

        <div className="note-details">
          <div className="note-field">
            <label>Note Title:</label>
            <span>{note.notetitle || "No data"}</span>
          </div>
          <div className="note-field">
            <label>Description:</label>
            <span>{note.description || "No data"}</span>
          </div>
        </div>

        <div className="button-group">
          <DeleteButton type="submit" aria-label="delete">
            Yes
          </DeleteButton>
          <CancelButton type="button" aria-label="cancel" onClick={handleCancel}>
            No
          </CancelButton>
        </div>
      </form>
    </div>
  );
}

export default DeleteNote;
