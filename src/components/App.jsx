import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Welcome from "./Welcome";
import Login from "./Login";
import Register from "./Register";
import EditNote from "./EditNote";
import DeleteNote from "./DeleteNote";
import useToken from "./useToken";
import { getUsers } from "../services/registeredUsers.js";
import { getNotes } from "../services/userNotes.js";

function App() {
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });
  const [content, setContent] = useState({
    type: "start",
  });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [users, setUsers] = useState([]);
  const { token, setToken } = useToken();
  const [isLoggedIn, setLogin] = useState(!!token);
  const [isEditing, setIsEditing] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isExpanded, setExpanded] = useState();
  const mounted = useRef(true);

  const handleAlert = (type, message) => {
    setAlert({
      type,
      message,
      visible: true,
    });
    if (type === "noteAdded") {
      setTimeout(reloadPage, 2000);
    }
  };

  const handleContent = (type) => {
    setContent({
      type,
    });
  };

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (isLoggedIn) {
      setContent({ type: "home" });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    mounted.current = true;
    if (!alert.visible) {
      return;
    }
    if (alert.type === "success") {
      getUsers().then((userItems) => {
        if (mounted.current) {
          setUsers(userItems || []);
        }
      });
      if (token) {
        getNotes(token).then((userNotes) => {
          if (mounted.current) {
            setNotes(userNotes || []);
          }
        });
      } else {
        console.log("Token is empty.");
      }
    }
    return () => (mounted.current = false);
  }, [alert]);

  useEffect(() => {
    if (alert.visible) {
      setTimeout(() => {
        if (mounted.current) {
          setAlert((prevAlert) => ({
            ...prevAlert,
            visible: false,
          }));
        }
      }, 2000);
    }
  }, [alert]);

  useEffect(() => {
    async function fetchNotes() {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            setToken("");
            setLogin(false);
            setIsEditing(false);
            setNoteToEdit(null);
            setNotes([]);
            localStorage.removeItem("notes");
            window.location.href = "/";
          } else {
            const fetchedNotes = await getNotes(token);
            if (fetchedNotes && fetchedNotes.length > 0) {
              setNotes(fetchedNotes);
              localStorage.setItem("notes", JSON.stringify(fetchedNotes));
            } else {
              setNotes([]);
              localStorage.removeItem("notes");
            } 
          }
        } catch (error) {
          console.error("Error decoding token or fetching notes:", error);
          setToken("");
          setLogin(false);
          setIsEditing(false);
          setNoteToEdit(null);
          setNotes([]);
          localStorage.removeItem("notes");
          window.location.href = "/";
        }
      }
    }

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setLogin(true);
    }

    if (savedToken) {
      fetchNotes();
    }
  }, [token, setToken]);

  useEffect(() => {
    setLogin(!!token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setNotes([]);
    }
  }, [token]);
  

  function addNote(newNote) {
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes, newNote];
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      handleAlert("success", "New note added successfully!");
      return updatedNotes;
    });
  }

  const deleteNote = (id) => {
    const deleteNote = notes.find((noteItem, index) => index === id);
    setNoteToDelete(deleteNote);
    setIsDeleting(true);
    handleContent("notes");
    window.scrollTo(0, 0);
  };

  const removeNote = (id) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((noteItem, index) => index !== id);
      setIsDeleting(false);
      setNoteToDelete(null);
      handleContent("home");
      return updatedNotes;
    });
  };

  const cancelAction = () => {
    setIsDeleting(false);
    setNoteToDelete(null);
    setIsEditing(false);
    setNoteToEdit(null);
    handleContent("home");
    window.scrollTo(0, 0);
  };

  const editNote = (id) => {
    const note = notes.find((noteItem, index) => index === id);
    setNoteToEdit(note);
    setIsEditing(true);
    handleContent("notes");
    window.scrollTo(0, 0);
  };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((noteItem, index) =>
        index === noteToEdit.id - 1 ? updatedNote : noteItem
      )
    );
    setIsEditing(false);
    setNoteToEdit(null);
    handleContent("home");
    window.scrollTo(0, 0);
  };

  return (
    <Router>
      <div className="app-container">
        <Header
          isLoggedIn={isLoggedIn}
          setToken={setToken}
          setLogin={setLogin}
          setAlert={handleAlert}
          setContent={handleContent}
          setIsEditing={setIsEditing}
          setIsDeleting={setIsDeleting}
          setExpanded={setExpanded}
          setNoteToEdit={setNoteToEdit}
          setNotes={setNotes}
        />
        <div className={`content-${content.type}`}>
          {alert.visible ? (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          ) : null}

          {!isLoggedIn && !token ? (
            <div className="main-panel-wrapper">
              <Routes>
                <Route path="" element={<Welcome />} />
                <Route
                  path="/register"
                  element={
                    <Register
                      setAlert={handleAlert}
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
                      setAlert={handleAlert}
                    />
                  }
                />
              </Routes>
            </div>
          ) : (
            <div className="content">
              {isEditing ? (
                <div>
                  <EditNote
                    note={noteToEdit}
                    onUpdate={updateNote}
                    setAlert={handleAlert}
                    setContent={handleContent}
                    setIsEditing={setIsEditing}
                    setIsDeleting={setIsDeleting}
                  />
                </div>
              ) : isDeleting ? (
                <div>
                  <DeleteNote
                    note={noteToDelete}
                    onRemove={removeNote}
                    setAlert={handleAlert}
                    cancelAction={cancelAction}
                  />
                </div>
              ) : (
                <>
                  <CreateArea
                    onAdd={addNote}
                    setAlert={handleAlert}
                    setContent={handleContent}
                    setExpanded={setExpanded}
                    isExpanded={isExpanded}
                  />
                  {notes && notes.length > 0 ? (
                    notes.map((noteItem, index) => (
                      <Note
                        key={index}
                        id={index}
                        section={noteItem.section}
                        linkTitle={noteItem.linkTitle}
                        url={noteItem.url}
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
