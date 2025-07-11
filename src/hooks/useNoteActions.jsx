// hooks/useNoteActions.js
export default function useNoteActions({
    notes,
    setNotes,
    showAlert,
    handleContent,
    setEditingStates,
  }) {
    const scrollToTop = () => window.scrollTo(0, 0);
  
    const addNote = (newNote) => {
      const updated = [...notes, newNote];
      setNotes(updated);
      showAlert("success", "New note added successfully!");
    };
  
    const editNote = (id) => {
      const note = notes.find((_, index) => index === id);
      setEditingStates({ type: "edit", note });
      handleContent("notes");
      scrollToTop();
    };
  
    const deleteNote = (id) => {
      const note = notes.find((_, index) => index === id);
      setEditingStates({ type: "delete", note });
      handleContent("notes");
      scrollToTop();
    };
  
    const removeNote = (id) => {
      const updated = notes.filter((_, index) => index !== id);
      setNotes(updated);
      setEditingStates({ type: null, note: null });
      handleContent("home");
    };
  
    const cancelAction = () => {
      setEditingStates({ type: null, note: null });
      handleContent("home");
      scrollToTop();
    };
  
    return { addNote, editNote, deleteNote, removeNote, cancelAction };
  }
  