// hooks/useContent.js
import { useState } from "react";

export default function useContent(initial = "start") {
  const [type, setType] = useState(initial);

  const handleContent = (newType) => {
    setType(newType);
  };

  return { type, handleContent };
}
