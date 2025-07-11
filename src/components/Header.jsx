import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";

function Header({
  isLoggedIn,
  logout,
  setToken,
  setLogin,
  setAlert,
  setContent,
  setNoteToEdit,
  setNotes,
  setIsDeleting
}) {
  const navigate = useNavigate();

  const handleReturnToHome = (e) => {
    e.preventDefault();
    setContent(isLoggedIn ? "home" : "start");
    setNoteToEdit(null);      // czyści notatkę do edycji
    setIsDeleting(false);     // czyści stan usuwania
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-brand" href="/" onClick={handleReturnToHome}>
          <FontAwesomeIcon className="icon" icon={faHandshake} />
          <span className="brand-text">Life Guide</span>
        </a>
        {isLoggedIn && (
          <div className="navbar-right">
            <Logout
              setLogin={setLogin}
              setToken={setToken}
              setAlert={setAlert}
              setContent={setContent}
              setNotes={setNotes}
              setNoteToEdit={setNoteToEdit}
              setIsDeleting={setIsDeleting}
            />
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
