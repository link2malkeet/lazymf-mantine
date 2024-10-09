// src/bootstrap.js
import { createRoot } from "react-dom/client";
import App from "./RemoteComponent1"; // Import the component to expose

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
