import React from "react";
import { Link, useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import ChatbotBox from "./AI_chat/ChatbotBox";
function Note({
  id,
  noteTitle,
  description,
  onEdit,
  onDelete,
  onToggleChat,
  isChatVisible,
  toggleChat,
  setContent,
}) {
  const navigate = useNavigate();

  function handleEditClick(event) {
    event.preventDefault();
    navigate(`/notes/${id + 1}`);
    onEdit(id);
  }

  function handleDeleteClick(event) {
    event.preventDefault();
    navigate(`/notes/${id + 1}`);
    onDelete(id);
    setContent("notes");
  }

  function handleChatClick(event) {
    event.preventDefault();
    toggleChat();
  }

  // const formatUrl = (url) => {
  //   if (!/^https?:\/\//i.test(url)) {
  //     return `https://${url}`;
  //   }
  //   return url;
  // };

  // const url = formatUrl(props.url);

  return (
    <div className="note">
      <h1>{noteTitle}</h1>
      <p>{description}</p>

      <button onClick={handleChatClick}>
        <ChatIcon />
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

      {/* ✅ Renderowanie chatbota tylko jeśli ten czat jest aktywny */}
      {isChatVisible && <ChatbotBox />}
    </div>
  );
}

export default Note;

