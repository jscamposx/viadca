<<<<<<< HEAD
import { StrictMode, useEffect, useState } from "react";
=======
import { StrictMode } from "react";
>>>>>>> a43597ef0d0800863cc9a06891b89c03d846e990
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx"; // añadido
<<<<<<< HEAD
import { MotionConfig } from "framer-motion";

function Root() {
  const [forceMotion, setForceMotion] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Ctrl+Alt+M para alternar animaciones aun con prefers-reduced-motion
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "m") {
        setForceMotion((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const rootEl = document.documentElement;
    if (forceMotion) {
      rootEl.classList.add("allow-motion");
    } else {
      rootEl.classList.remove("allow-motion");
    }
  }, [forceMotion]);

  return (
    <MotionConfig reducedMotion={forceMotion ? "never" : "user"}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
=======

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
>>>>>>> a43597ef0d0800863cc9a06891b89c03d846e990
  </StrictMode>,
);
