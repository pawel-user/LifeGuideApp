import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zoom, Fab } from "@mui/material";
import { editNote } from "../services/userNotes.js";
import EditIcon from "@mui/icons-material/Edit";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";

function EditNote({ note, onUpdate, setAlert, setContent, setIsEditing, setIsDeleting}) {
  const navigate = useNavigate();
  
  const [isExpanded, setExpanded] = useState(false);
  const [editedNote, setEditedNote] = useState({
    section: "",
    url: "",
    linkTitle: "",
    description: "",
    ...note,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  function handleCancel(event) {
    event.preventDefault();
    setAlert("warning", "Action was canceled.");
    setContent("home");
    setIsEditing(false);
    setIsDeleting(false);
    navigate("/");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !editedNote.section ||
      !editedNote.linkTitle ||
      !editedNote.url ||
      !editedNote.description
    ) {
      setAlert(
        "error",
        "Empty fields detected! You need complete all input fields."
      );
      return;
    }

    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
    if (!urlRegex.test(editedNote.url)) {
      setAlert(
        "error",
        "Edited for invalid the website URL format! Please edit again."
      );
      return;
    }

    try {
      const response = await editNote(editedNote.id, editedNote);
      if (response.status === 404) {
        setAlert("error", "Note not found!");
        return;
      }
      if (response.status === 400) {
        setAlert("error", "Note with the website URL already exists.");
        return;
      }
      if (response) {
        onUpdate(editedNote);
        setAlert(
          "success",
          `Note with id  ${editedNote.id} was edited succesfully`
        );
      }
    } catch (error) {
      console.error("Error while editing user note:", error);
    }
  }

  function toggle(isExpanded) {
    setExpanded(!isExpanded);
  }

  const clearInputs = (e) => {
    e.preventDefault();
    setEditedNote({
      section: "",
      url: "",
      linkTitle: "",
      description: "",
    });
  };

  return (
    <div className="edit-container">
      <form className="create-note" onSubmit={handleSubmit}>
        <h2>Edit User Note</h2>
        <input
          name="section"
          onChange={handleChange}
          value={editedNote.section || ""}
          placeholder="Section"
        />
        <input
          name="url"
          onChange={handleChange}
          value={editedNote.url || ""}
          placeholder="URL website address"
        />
        <input
          name="linkTitle"
          onChange={handleChange}
          value={editedNote.linkTitle || ""}
          placeholder="Title of the website link"
        />
        <textarea
          name="description"
          onClick={() => toggle(isExpanded)}
          onChange={handleChange}
          value={editedNote.description || ""}
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
              aria-label="clear"
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
