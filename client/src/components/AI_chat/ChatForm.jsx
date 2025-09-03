import { useRef } from "react";

const ChatForm = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  saveMessageToDB,
}) => {
  const inputRef = useRef();

  // Handle form submission when user sends a message
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Prepare updated chat history with user's message
    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];

    // Update chat history in UI
    setChatHistory(updatedHistory);

    // Save user's message to the database
    try {
      await saveMessageToDB("user", userMessage);
    } catch (err) {
      console.error("Failed to save user message:", err);
    }

    // Add temporary bot message while waiting for response
    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking...", isLoading: true },
      ]);

      // Generate bot response using full updated history
      generateBotResponse([
        ...updatedHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  // Handle Enter key behavior: submit on Enter, allow new line with Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <textarea
        ref={inputRef}
        placeholder="Message..."
        className="message-input"
        onKeyDown={handleKeyDown}
        rows={6}
        required
      />
      <button className="material-symbols-rounded" title="Send message">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
