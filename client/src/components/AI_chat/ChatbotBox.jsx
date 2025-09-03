// ./AI_chat/ChatbotBox.jsx
import React, { useRef, useState, useEffect } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import "../../CSS-styles/chat-styles.css";
import ChatMessage from "./ChatMessage";
import ConfirmModal from "./ConfirmModal";
import FeedbackModal from "./FeedbackModal";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { coachInfo } from "../../coachInfo.js";

function ChatbotBox({ onClose, noteId, token }) {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: coachInfo,
    },
  ]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackIcon, setFeedbackIcon] = useState("");

  const chatBodyRef = useRef();

  const handleDeleteHistory = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setChatHistory([
          {
            hideInChat: true,
            role: "model",
            text: coachInfo,
          },
        ]);
        setFeedbackMessage("✅ Chat history deleted successfully.");
        setFeedbackIcon("✅");
      } else {
        console.error("Failed to delete chat history from database.");
        setFeedbackMessage("⚠️ Failed to delete chat history.");
        setFeedbackIcon("⚠️");
      }
    } catch (err) {
      console.error("Error deleting chat history:", err);
      setFeedbackMessage("❌ Error occurred during deletion.");
      setFeedbackIcon("❌");
    } finally {
      setShowConfirm(false);
      setShowFeedbackModal(true);
      setTimeout(() => setShowFeedbackModal(false), 2500);
    }
  };

  const cancelDeleteHistory = () => {
    setShowConfirm(false);
    setFeedbackMessage("❌ Deletion cancelled.");
    setFeedbackIcon("❌");
    setShowFeedbackModal(true);
    setTimeout(() => setShowFeedbackModal(false), 2500);
  };

  const saveMessageToDB = async (sender, message) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/chat/${noteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender, message }),
      });
    } catch (err) {
      console.error("Błąd zapisu wiadomości:", err);
    }
  };

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
      saveMessageToDB("ai", text);
    };
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_GEMINI_API_URL}?key=${
          import.meta.env.VITE_API_KEY
        }`,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong!");
      }

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (!token) {
      console.warn("Brak tokena — użytkownik nieautoryzowany");
      return;
    }

    async function fetchChatHistory() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }

        const data = await res.json();

        const formatted = data.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          text: msg.message,
        }));

        setChatHistory((prev) => [...prev, ...formatted]);
      } catch (err) {
        console.error("Błąd ładowania historii czatu:", err);
      }
    }

    fetchChatHistory();
  }, [noteId, token]);

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="chatbox-wrapper">
      <div className={"container show-chatbot"}>
        <div className="chatbot-popup">
          {/* Chatbot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">ChatCoach</h2>
              <button onClick={onClose} className="material-symbols-rounded">
                keyboard_arrow_down
              </button>
            </div>
          </div>
          {/* Chatbot Body */}
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey there 👋 <br /> How can I help you today?
              </p>
            </div>
            {/* Render the chat history dynamically */}
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          {/* Chatbot Footer */}
          <div className="chat-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
              saveMessageToDB={saveMessageToDB}
            />
            {/* Delete chat history button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="chat-delete-button"
              title="Delete chat history"
            >
              <DeleteOutlineIcon className="delete-icon" />
            </button>

            <button
              onClick={onClose}
              className="chat-close-button"
              title="Close chat"
            >
              <CloseIcon className="close-icon" />
            </button>
          </div>
          {/* 🔔 MODAL POTWIERDZENIA */}
          {showConfirm && (
            <ConfirmModal
              message="Are you sure you want to delete the entire chat history?"
              onConfirm={handleDeleteHistory}
              onCancel={cancelDeleteHistory}
            />
          )}

          {showFeedbackModal && (
            <FeedbackModal message={feedbackMessage} icon={feedbackIcon} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatbotBox;
