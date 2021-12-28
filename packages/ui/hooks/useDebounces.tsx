import React, { useState } from "react";

export default function useDebounces() {
  const [ready, setReady] = useState(true);

  const handleDebounce = () => {
    setReady(false);
    setTimeout(() => {
      setReady(true);
    }, 100);
  };

  return { ready, handleDebounce };
}
