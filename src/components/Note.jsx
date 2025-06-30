import React from "react";
import { Link, useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  const navigate = useNavigate();

  function handleEditClick(event) {
    event.preventDefault();
    navigate(`/notes/${props.id + 1}`);
    props.onEdit(props.id);
  }
  function handleDeleteClick(event) {
    event.preventDefault();
    navigate(`/notes/${props.id + 1}`);
    props.onDelete(props.id);
    props.setContent("notes");
  }

  const formatUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const url = formatUrl(props.url);

  return (
    <div className="note">
      <h1>{props.section}</h1>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {props.linkTitle}
      </a>{" "}
      <p>{props.description}</p>
      <Link
        component={Link}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={handleDeleteClick}
      >
        <button onClick={handleDeleteClick}>
          <DeleteIcon />
        </button>
      </Link>
      <Link
        component={Link}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={handleEditClick}
      >
        <button onClick={handleEditClick}>
          <EditNoteIcon />
        </button>
      </Link>
    </div>
  );
}

export default Note;
