import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import CloseIcon from "@mui/icons-material/Close";
import ChatbotBox from "./AI_chat/ChatbotBox";

function Note({
  id,
  noteTitle,
  description,
  onEdit,
  onDelete,
  isChatVisible,
  toggleChat,
  setContent,
}) {
  const navigate = useNavigate();

  function handleEditClick(event) {
    event.preventDefault();
    navigate(`/notes/${id + 1}`);
    onEdit(id, noteTitle, description);
  }

  function handleDeleteClick(event) {
    event.preventDefault();
    navigate(`/notes/${id + 1}`);
    onDelete(id, noteTitle, description);
    setContent("notes");
  }

  return (
    <>
      <div className="note">
        <h1>{noteTitle}</h1>
        <p>{description}</p>

        {/* 🔘 Przycisk do otwierania/zamykania chatbota */}
        <button onClick={toggleChat} id="chatbot-toggler">
          <span className="material-symbols-rounded">
            {isChatVisible ? <CloseIcon /> : <ModeCommentIcon />}
          </span>
        </button>

        <Link
          component={Link}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={handleDeleteClick}
        >
          <button>
            <DeleteIcon />
          </button>
        </Link>

        <Link
          component={Link}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={handleEditClick}
        >
          <button>
            <EditNoteIcon />
          </button>
        </Link>
      </div>

      {isChatVisible && <ChatbotBox onClose={toggleChat} />}
    </>
  );
}

export default Note;
