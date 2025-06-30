import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteNote } from "../services/userNotes.js";
import { DeleteButton, CancelButton } from "../styles/styledButtons.js";

function DeleteNote({ note, onRemove, setAlert, cancelAction }) {
  const [deletedNote, setDeletedNote] = useState(note);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await deleteNote(deletedNote.id);
      if (response.status === 404) {
        setAlert("error", "Note not found!");
        return;
      }
      if (response) {
        onRemove(deletedNote.id);
        setAlert(
          "success",
          `Note with id ${deletedNote.id} was deleted successfully`
        );
      }
    } catch (error) {
      console.error("Error while removing user note:", error);
    }
  }

  function handleCancel() {
    setAlert("error", "Delete canceled");
    cancelAction();
    navigate("/");
  }

  return (
    <div className="delete-container">
      <form className="create-note" onSubmit={handleSubmit}>
        <h2>Delete User Note</h2>
        <p className="form-question">Are you sure to delete this note?</p>

        <div className="note-details">
          <div className="note-field">
            <label>Section:</label>
            <span>{deletedNote.section || "No data"}</span>
          </div>
          <div className="note-field">
            <label>Address URL:</label>
            <span>{deletedNote.url || "No data"}</span>
          </div>
          <div className="note-field">
            <label>Link Title:</label>
            <span>{deletedNote.linkTitle || "No data"}</span>
          </div>
          <div className="note-field">
            <label>Description:</label>
            <span>{deletedNote.description || "No data"}</span>
          </div>
        </div>

        <div className="button-group">
          <DeleteButton variant="contained" type="submit" aria-label="delete">
            Yes
          </DeleteButton>
          <CancelButton
            variant="contained"
            type="button"
            aria-label="cancel"
            onClick={handleCancel}
          >
            No
          </CancelButton>
        </div>
      </form>
    </div>
  );
}

export default DeleteNote;
