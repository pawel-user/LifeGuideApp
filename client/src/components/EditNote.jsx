import React, { useState } from "react";
import { Zoom, Fab } from "@mui/material";
import { editNote } from "../services/userNotes.js";
import EditIcon from "@mui/icons-material/Edit";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";

function EditNote({ note, onUpdate, setAlert, setContent, cancelAction }) {
  // console.log("📋 Notatka przekazana do EditNote:", note);
  const [isExpanded, setExpanded] = useState(false);
  const [editedNote, setEditedNote] = useState({
    noteTitle: note.noteTitle ?? note.notetitle ?? "",
    description: note.description ?? "",
    id: note.id,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!editedNote.noteTitle || !editedNote.description) {
      setAlert("error", "You need to fill out all fields before saving.");
      return;
    }

    try {
      const response = await editNote(editedNote.id, {
        noteTitle: editedNote.noteTitle,
        description: editedNote.description,
      });

      if (response?.status === 404) {
        setAlert("error", "Note not found.");
        return;
      }

      if (response?.status === 400) {
        setAlert("error", "Duplicate note or invalid format.");
        return;
      }

      if (response) {
        onUpdate(editedNote);
        setAlert("success", "Note updated successfully.");
      }
    } catch (error) {
      console.error("Error editing note:", error);
      setAlert("error", "Update failed. Please try again.");
    }
  }

  function handleCancel(event) {
    event.preventDefault();
    setAlert("info", "Editing canceled.");
    setContent("home");
    cancelAction();
  }

  function toggle(isExpanded) {
    setExpanded(!isExpanded);
  }

  function clearInputs(event) {
    event.preventDefault();
    setEditedNote({
      noteTitle: "",
      description: "",
      id: note.id,
    });
  }

  return (
    <div className="edit-container">
      <form className="create-note" onSubmit={handleSubmit}>
        <h2>Edit User Note</h2>
        <input
          name="noteTitle"
          onChange={handleChange}
          value={editedNote.noteTitle}
          placeholder="Title of the life problem"
        />
        <textarea
          name="description"
          onClick={() => toggle(isExpanded)}
          onChange={handleChange}
          value={editedNote.description}
          placeholder="Take a note..."
          rows={isExpanded ? 6 : 1}
        />
        <div className="fab-buttons-container">
          <Zoom in={true}>
            <Fab
              className="fab-edit-button"
              type="submit"
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </Fab>
          </Zoom>
          <Zoom in={true}>
            <Fab
              className="fab-clear-button"
              onClick={clearInputs}
              color="primary"
              aria-label="clear"
            >
              <ClearAllIcon />
            </Fab>
          </Zoom>
          <Zoom in={true}>
            <Fab
              className="fab-cancel-button"
              onClick={handleCancel}
              color="primary"
              aria-label="cancel"
            >
              <CloseIcon />
            </Fab>
          </Zoom>
        </div>
      </form>
    </div>
  );
}

export default EditNote;
