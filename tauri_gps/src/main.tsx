import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Set viewport meta to prevent scaling issues on mobile
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content =
  "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.getElementsByTagName("head")[0].appendChild(meta);

// Ensure DOM is fully loaded before rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}
