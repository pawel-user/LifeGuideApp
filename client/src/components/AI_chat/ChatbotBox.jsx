// ./AI_chat/ChatbotBox.jsx
import React, {useRef, useState, useEffect } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import "../../CSS-styles/chat-styles.css";
import ChatMessage from "./ChatMessage";

function ChatbotBox() {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}]);
    }
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
        `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_API_KEY}`,
        requestOptions
      );
      const text = await response.text();
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
  
      const data = text ? JSON.parse(text) : {};

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error("Błąd API:", error.message);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <div className="chatbox-wrapper">
      <div className="container show-chatbot">
        <div className="chatbot-popup">
          {/* Chatbot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">ChatCoach</h2>
              <button className="material-symbols-rounded">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotBox;
