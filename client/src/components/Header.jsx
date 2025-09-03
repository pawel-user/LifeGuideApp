import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Logout from "./Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";

function Header(authProps) {
  const {
    isLoggedIn,
    logout,
    login,
    setLogin,
    setAlert,
    setContent,
    setNoteToEdit,
    setNotes,
    setIsDeleting,
  } = authProps;

  const navigate = useNavigate();

  const handleReturnToHome = (e) => {
    e.preventDefault();
    setContent(isLoggedIn ? "home" : "start");
    setNoteToEdit(null);
    setIsDeleting(false);
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar">
        <Link to="/" onClick={handleReturnToHome} className="navbar-brand">
          <FontAwesomeIcon className="icon" icon={faHandshake} />
          <span className="brand-text">Life Guide</span>
        </Link>

        {isLoggedIn && (
          <div className="navbar-right">
            <Logout
              logout={logout}
              setLogin={setLogin}
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
