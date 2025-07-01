import React, { useState } from "react";
import { addNote } from "../services/userNotes.js";
import AddIcon from "@mui/icons-material/Add";
import WrapTextIcon from "@mui/icons-material/WrapText";
import CloseIcon from "@mui/icons-material/Close";
import { Zoom } from "@mui/material";
import { Fab } from "@mui/material";

function CreateArea(props) {
  const [note, setNote] = useState({
    noteTitle: "",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event) {
    event.preventDefault();
    if (!note.noteTitle || !note.description) {
      props.setAlert(
        "error",
        "Empty fields detected! All input fields are required."
      );
      return;
    }

    // const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
    // if (!urlRegex.test(note.url)) {
    //   props.setAlert(
    //     "error",
    //     "Invalid the website URL format! Please try again."
    //   );
    //   return;
    // }

    try {
      const response = await addNote(note);
      if (response.status === 201) {
        props.onAdd(note);
        setNote({
          noteTitle: "",
          description: "",
        });
        props.setExpanded(false);
      }
    } catch (error) {
      console.error("Error while adding new user note:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "Note with the website URL already exists"
      ) {
        props.setAlert("error", "Note with the website URL already exists!");
      } else {
        props.setAlert(
          "error",
          "Error while adding new user note. Please try again."
        );
      }
    }
  }

  function toggle() {
    props.setExpanded(!props.isExpanded);
    props.setContent("home");
  }

  function expand() {
    props.setExpanded(true);
    props.setContent("home");
  }

  function toggleClearAndCancel() {
    props.setExpanded(false);
    setNote({
      noteTitle: "",
      description: "",
    });
    props.setAlert("warning", "The action was canceled.");
  }

  return (
    <div className="create-note-area">
      <form className="create-note">
        
        {props.isExpanded ? (
          <input
            name="noteTitle"
            onChange={handleChange}
            value={note.noteTitle}
            placeholder="Title of the life problem"
          />
        ) : null}

        <textarea
          name="description"
          onClick={() => expand()}
          onChange={handleChange}
          value={note.description}
          placeholder="Take a note..."
          rows={props.isExpanded ? 6 : 1}
        />
        <div className="fab-buttons-container2">
          <Zoom in={props.isExpanded}>
            <Fab onClick={submitNote}>
              <AddIcon />
            </Fab>
          </Zoom>
          <Zoom in={props.isExpanded}>
            <Fab onClick={() => toggle(props.isExpanded)}>
              <WrapTextIcon />
            </Fab>
          </Zoom>
          <Zoom in={props.isExpanded}>
            <Fab onClick={toggleClearAndCancel}>
              <CloseIcon />
            </Fab>
          </Zoom>
        </div>
      </form>
    </div>
  );
}

export default CreateArea;
