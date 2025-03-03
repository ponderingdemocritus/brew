import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

console.log("main.tsx: Starting application");

// Create a new router instance
const router = createRouter({
  routeTree,
  // Disable preloading to prevent infinite loops
  defaultPreload: false,
});

console.log("main.tsx: Router created");

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Initialize the router
router.load().catch((error) => {
  console.error("main.tsx: Error initializing router:", error);
});

console.log("main.tsx: Router initialized");

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  console.log("main.tsx: Rendering app");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
  console.log("main.tsx: App rendered");
}
