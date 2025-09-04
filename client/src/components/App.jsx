import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Welcome from "./Welcome";
import Login from "./Login";
import Register from "./Register";
import EditNote from "./EditNote";
import DeleteNote from "./DeleteNote";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import useNotes from "../hooks/useNotes";
import useContent from "../hooks/useContent";
import useNoteActions from "../hooks/useNoteActions";
import useLayoutMargin from "../hooks/useLayoutMargin";
import useFetchNotes from "../hooks/useFetchNotes";
import useChatbot from "../hooks/useChatbot";
import { usePostLoginEffect } from "../hooks/usePostLoginEffect";
import RedirectHandler from "./RedirectHandler";
import ChatbotBox from "./AI_chat/ChatbotBox";

import "../CSS-styles/styles.css";

function App() {
  const {
    token,
    login,
    logout,
    isLoggedIn,
    setLogin,
    getValidToken,
    isAuthInitialized,
  } = useAuth();

  const { alert, showAlert } = useAlerts();
  const { type: contentType, handleContent } = useContent();

  const [notes, setNotes] = useNotes(token, isLoggedIn, getValidToken, logout);

  const [editingStates, setEditingStates] = useState({
    type: null,
    note: null,
  });

  const [isExpanded, setExpanded] = useState(false);
  const isEditing = editingStates.type === "edit";
  const isDeleting = editingStates.type === "delete";

  const { addNote, editNote, deleteNote, removeNote, cancelAction } =
    useNoteActions({
      notes,
      setNotes,
      showAlert,
      handleContent,
      setEditingStates,
    });

  const { visibleChatForNoteId, toggleChatForNote } = useChatbot();

  useLayoutMargin(isExpanded);

  // ✅ Wywołanie hooka wewnątrz komponentu
  useFetchNotes({ isLoggedIn, token, getValidToken, setNotes, showAlert });
  usePostLoginEffect({ isLoggedIn, token, setEditingStates });

  const authProps = {
    isLoggedIn,
    logout,
    login,
    setLogin,
    setAlert: showAlert,
    setContent: handleContent,
    setNoteToEdit: (note) => setEditingStates({ type: "edit", note }),
    setNotes,
    setIsDeleting: (flag) =>
      setEditingStates((prev) => ({
        ...prev,
        type: flag ? "delete" : null,
      })),
  };

  return (
    <div className="main-app-wrapper">
      <div className="app-container">
        <Header {...authProps} />

        <div className={`content-${contentType}`}>
          {alert.visible && (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          )}

          {!isLoggedIn ? (
            <div className="main-panel-wrapper">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route
                  path="/register"
                  element={
                    <Register setAlert={showAlert} setContent={handleContent} />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Login
                      login={login}
                      setLogin={setLogin}
                      setContent={handleContent}
                      setAlert={showAlert}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <RedirectHandler
                      logout={logout}
                      setLogin={setLogin}
                      login={login}
                      showAlert={showAlert}
                    />
                  }
                />
              </Routes>
            </div>
          ) : (
            <div className="content">
              {isEditing ? (
                <EditNote
                  note={editingStates.note}
                  onUpdate={(updatedNote) => {
                    setNotes((prev) =>
                      prev.map((note) =>
                        note.id === updatedNote.id
                          ? { ...note, ...updatedNote }
                          : note
                      )
                    );
                    setEditingStates({ type: null, note: null });
                    handleContent("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  setAlert={showAlert}
                  setContent={handleContent}
                  cancelAction={cancelAction}
                />
              ) : isDeleting ? (
                <DeleteNote
                  note={editingStates.note}
                  onRemove={removeNote}
                  setAlert={showAlert}
                  cancelAction={cancelAction}
                />
              ) : (
                <>
                  <CreateArea
                    onAdd={addNote}
                    setAlert={showAlert}
                    setContent={handleContent}
                    setExpanded={setExpanded}
                    isExpanded={isExpanded}
                  />

                  {Array.isArray(notes) && notes.length > 0 ? (
                    <div className="notes-container">
                      {notes.map((noteItem, index) => (
                        <React.Fragment key={index}>
                          <Note
                            id={noteItem.id}
                            noteTitle={noteItem.noteTitle}
                            description={noteItem.description}
                            onEdit={editNote}
                            onDelete={deleteNote}
                            setContent={handleContent}
                            isChatVisible={visibleChatForNoteId === noteItem.id}
                            toggleChat={() => toggleChatForNote(noteItem.id)}
                          />
                          <>
                            {/* {isAuthInitialized &&
                            visibleChatForNoteId === noteItem.id &&
                            typeof token === "string" &&
                            token.trim().length > 0 &&
                            typeof noteItem.id === "number" ? (
                              <ChatbotBox
                                onClose={() => toggleChatForNote(noteItem.id)}
                                noteId={noteItem.id}
                                token={token}
                              />
                            ) : null} */}
                            {visibleChatForNoteId === noteItem.id && (
                              <ChatbotBox
                                onClose={() => toggleChatForNote(noteItem.id)}
                                noteId={noteItem.id}
                                token={token}
                              />
                            )}
                          </>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="info-container">
                      <p>No notes available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
