import React from "react";
import "../../CSS-styles/confirm-modal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="warning-icon">⚠️</div>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button className="confirm-btn delete" onClick={onConfirm}>
            Delete
          </button>
          <button className="confirm-btn cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
