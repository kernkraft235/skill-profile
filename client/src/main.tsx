import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure modern browsers support used features
const supportsModernBrowserFeatures = 'IntersectionObserver' in window && 'fetch' in window;

if (!supportsModernBrowserFeatures) {
  // If browser doesn't support modern features, show a warning
  document.getElementById("root")!.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Browser Not Supported</h2>
      <p>Please use a modern browser like Chrome, Firefox, Edge, or Safari to view this portfolio.</p>
    </div>
  `;
} else {
  // Modern browser, render the app
  createRoot(document.getElementById("root")!).render(<App />);
}
