import { useEffect } from "react";

export default function useLayoutMargin(isExpanded = false) {
  useEffect(() => {
    const setMargin = () => {
      const createArea = document.querySelector(".create-note-area");
      const content = document.querySelector(".notes-container");
      const header = document.querySelector("header");

      if (createArea && content && header) {
        const areaHeight = createArea.getBoundingClientRect().height;
        const headerHeight = header.getBoundingClientRect().height;
        const marginOffset = headerHeight + areaHeight - 80;
        content.style.marginTop = `${marginOffset}px`;
      }
    };

    // 💡 Aktualizuj margines na starcie
    const timeout = setTimeout(() => {
      setMargin();
    }, 150);

    // 🌀 Obserwuj zmiany wysokości formularza
    const createArea = document.querySelector(".create-note-area");
    const resizeObserver = createArea
      ? new ResizeObserver(() => setMargin())
      : null;
    if (resizeObserver && createArea) resizeObserver.observe(createArea);

    // 🖼 Aktualizuj po każdej zmianie `isExpanded`
    requestAnimationFrame(() => {
      setMargin();
    });

    // 🌍 Aktualizuj przy zmianie rozmiaru okna
    window.addEventListener("resize", setMargin);

    return () => {
      clearTimeout(timeout);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", setMargin);
    };
  }, [isExpanded]);
}
