import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const { token, setToken, isLoggedIn, setLogin, logout } = useAuth();
  const { alert, showAlert } = useAlerts();
  const { type: contentType, handleContent } = useContent();
  const [notes, setNotes] = useNotes(token, setToken, setLogin);
  const [editingStates, setEditingStates] = React.useState({
    type: null,
    note: null,
  });
  const [isExpanded, setExpanded] = React.useState();

  const {
    addNote,
    editNote,
    deleteNote,
    removeNote,
    cancelAction,
  } = useNoteActions({
    notes,
    setNotes,
    showAlert,
    handleContent,
    setEditingStates,
  });

  return (
    <Router>
      <div className="app-container">
        <Header
          isLoggedIn={isLoggedIn}
          logout={logout}
          setToken={setToken}
          setLogin={setLogin}
          setAlert={showAlert}
          setContent={handleContent}
          setNoteToEdit={(note) =>
            setEditingStates({ type: "edit", note })
          }
          setNotes={setNotes}
          setIsDeleting={(flag) =>
            setEditingStates((prev) => ({
              ...prev,
              type: flag ? "delete" : null,
            }))
          }
        />
        <div className={`content-${contentType}`}>
          {alert.visible && (
            <div className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          )}

          {!isLoggedIn || !token ? (
            <div className="main-panel-wrapper">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route
                  path="/register"
                  element={
                    <Register
                      setAlert={showAlert}
                      setContent={handleContent}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Login
                      setToken={setToken}
                      setLogin={setLogin}
                      setContent={handleContent}
                      setAlert={showAlert}
                    />
                  }
                />
              </Routes>
            </div>
          ) : (
            <div className="content">
              {editingStates.type === "edit" ? (
                <EditNote
                  note={editingStates.note}
                  onUpdate={(updatedNote) => {
                    setNotes((prev) =>
                      prev.map((note, index) =>
                        index === editingStates.note.id - 1
                          ? updatedNote
                          : note
                      )
                    );
                    setEditingStates({ type: null, note: null });
                    handleContent("home");
                  }}
                  setAlert={showAlert}
                  setContent={handleContent}
                  cancelAction={cancelAction}
                />
              ) : editingStates.type === "delete" ? (
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
                  {notes.length > 0 ? (
                    notes.map((noteItem, index) => (
                      <Note
                        key={index}
                        id={index}
                        noteTitle={noteItem.notetitle}
                        description={noteItem.description}
                        onEdit={editNote}
                        onDelete={deleteNote}
                        setContent={handleContent}
                      />
                    ))
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
    </Router>
  );
}

export default App;
