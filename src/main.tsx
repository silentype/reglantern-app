import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { VercelToolbarMount } from "./app/components/VercelToolbarMount.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <VercelToolbarMount />
  </BrowserRouter>
);
