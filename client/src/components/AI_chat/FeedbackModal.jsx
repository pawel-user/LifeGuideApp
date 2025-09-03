import React from "react";
import "../../CSS-styles/feedback-modal.css";

const FeedbackModal = ({ message, icon }) => {
  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-icon">{icon}</div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default FeedbackModal;
