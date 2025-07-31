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
      const formattedNote = {
        noteTitle: newNote.noteTitle ?? newNote.notetitle,
        description: newNote.description,
        id: newNote.id,
      };
      const updated = [...notes, formattedNote];
      setNotes(updated);
      showAlert("success", "New note added successfully!");
    }; 
  
    const editNote = (id) => {
      
      const note = notes.find((note) => note.id === id);
      setEditingStates({ type: "edit", note });
      handleContent("notes");
      scrollToTop();
    };
  
    const deleteNote = (id) => {
      const note = notes.find((note) => note.id === id);
      setEditingStates({ type: "delete", note });
      handleContent("notes");
      scrollToTop();
    };
  
    const removeNote = (id) => {
      const updated = notes.filter((note) => note.id !== id);
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
  