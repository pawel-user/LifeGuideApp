// src/utils/adjustLayout.js
export default function adjustLayoutMargin() {
  const createArea = document.querySelector(".create-note-area");
  const content = document.querySelector(".notes-container");
  const header = document.querySelector("header");

  const setMargin = () => {
    if (createArea && content && header) {
      const offset = (createArea.offsetHeight + header.offsetHeight)*0.80;
      content.style.marginTop = `${offset}px`;
    }
  };

  // Pierwsze wywołanie
  setMargin();

  // Dodanie obserwatora dla zmian CreateArea
  if (createArea) {
    const resizeObserver = new ResizeObserver(() => {
      setMargin();
    });
    resizeObserver.observe(createArea);

    // Opcjonalnie: wyczyść obserwator przy unmount (jeśli robisz to w hooku)
    return () => resizeObserver.disconnect();
  }

  // Obsługa zmiany rozmiaru okna
  window.addEventListener("resize", setMargin);
}
