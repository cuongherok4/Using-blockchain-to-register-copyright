import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> {/* CHỈ DÙNG MỘT LẦN DUY NHẤT Ở ĐÂY */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
