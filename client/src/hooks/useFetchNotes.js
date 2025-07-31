import { useEffect } from "react";

export default function useFetchNotes({
  isLoggedIn,
  token,
  getValidToken,
  setNotes,
  showAlert,
}) {
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const validToken = await getValidToken();
        if (!validToken) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/notes`,
          {
            headers: {
              Authorization: `Bearer ${validToken}`,
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((note) => ({
            id: note.id,
            noteTitle: note.notetitle,
            description: note.description,
          }));
          setNotes(mapped);
          if (mapped.length === 0) {
            setTimeout(() => {
              showAlert("info", "No notes available yet");
            }, 2000); 
          } else {
            showAlert("success", "Notes loaded successfully");
          }
        } else {
          showAlert("warning", "No notes found");
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        showAlert("error", "Failed to load notes");
      }
    };

    if (isLoggedIn && token) {
      fetchNotes();
    }
  }, [isLoggedIn, token]);
}
