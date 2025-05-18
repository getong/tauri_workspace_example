// Note: If you encounter OpenSSL build errors, set OPENSSL_DIR environment variable
// e.g., export OPENSSL_DIR=$(brew --prefix openssl@3) on macOS

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";

import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
