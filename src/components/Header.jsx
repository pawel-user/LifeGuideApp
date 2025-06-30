import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';

function Header(props) {
  const navigate = useNavigate();

  const handleReturnToHome = (e) => {
    e.preventDefault();
    if (props.isLoggedIn) {
      props.setContent("home");
    } else {
      props.setContent("start");
    }
    props.setIsEditing(false);
    props.setIsDeleting(false);
    props.setExpanded(false);
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-brand" href="/" onClick={handleReturnToHome}>
          <FontAwesomeIcon className="icon" icon={faHandshake} />
          <span className="brand-text">Life Guide</span>
        </a>
        {props.isLoggedIn ? (
          <div className="navbar-right">
            <Logout
              setLogin={props.setLogin}
              setToken={props.setToken}
              setAlert={props.setAlert}
              setContent={props.setContent}
              setIsEditing={props.setIsEditing}
              setNoteToEdit={props.setIsEditing}
              setIsDeleting={props.setIsDeleting}
              setNotes={props.setNotes}
            />
          </div>
        ) : null}
      </nav>
    </header>
  );
}

export default Header;
