import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

const originalConsoleWarn = console.warn;
const messagesToIgnore = [
  "As of March 1st, 2025, google.maps.places.Autocomplete is not available",
  "As of March 1st, 2025, google.maps.places.PlacesService is not available",
];

console.warn = function (...args) {
  const firstArg = args[0];
  if (
    typeof firstArg === "string" &&
    messagesToIgnore.some((msg) => firstArg.startsWith(msg))
  ) {
    return;
  }

  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
