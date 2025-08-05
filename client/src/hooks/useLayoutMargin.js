import { useEffect } from "react";

export default function useLayoutMargin(isExpanded = false) {
  useEffect(() => {
    const setMargin = () => {
      const createArea = document.querySelector(".create-note-area");
      const notesContainer = document.querySelector(".notes-container");
      const header = document.querySelector("header");

      if (createArea && notesContainer && header) {
        const areaHeight = createArea.getBoundingClientRect().height;
        const headerHeight = header.getBoundingClientRect().height;
        const marginOffset = headerHeight + areaHeight - 80;

        document.documentElement.style.setProperty(
          "--layout-margin",
          `${marginOffset}px`
        );

        notesContainer.style.marginTop = `${marginOffset}px`; // ✅ teraz działa
      }
    };

    // ⏱ Poczekaj chwilę po załadowaniu
    const timeout = setTimeout(() => {
      setMargin();
    }, 300);

    // 🌀 Obserwuj zmiany wysokości formularza
    const createArea = document.querySelector(".create-note-area");
    const resizeObserver = createArea
      ? new ResizeObserver(() => setMargin())
      : null;
    if (resizeObserver && createArea) resizeObserver.observe(createArea);

    // 🧬 Obserwuj DOM, czy notes-container się pojawi
    const observer = new MutationObserver(() => {
      const notesContainer = document.querySelector(".notes-container");
      if (notesContainer) {
        setMargin();
        observer.disconnect(); // tylko raz
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 🌍 Aktualizuj przy zmianie rozmiaru okna
    window.addEventListener("resize", setMargin);

    return () => {
      clearTimeout(timeout);
      if (resizeObserver) resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", setMargin);
    };
  }, [isExpanded]);
}
