// ./AI_chat/ChatbotBox.jsx
import React, { useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import "../../CSS-styles/chat-styles.css";
import ChatMessage from "./ChatMessage";

function ChatbotBox() {
  const [chatHistory, setChatHistory] = useState([]);

  console.log("ChatbotBox rendered");
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
          <div className="chat-body">
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
            <ChatForm setChatHistory={setChatHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotBox;
