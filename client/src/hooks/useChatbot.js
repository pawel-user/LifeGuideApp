import { useState } from "react";

function useChatbot() {
  const [visibleChatForNoteId, setVisibleChatForNoteId] = useState(null);

  const toggleChatForNote = (id) => {
    setVisibleChatForNoteId((prevId) => (prevId === id ? null : id));
  };

  const closeChat = () => {
    setVisibleChatForNoteId(null);
  };

  return {
    visibleChatForNoteId,
    toggleChatForNote,
    closeChat,
  };
}

export default useChatbot;
