import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerAllFormTemplates } from "./services/formTemplates";

// ثبت الگوهای استاندارد فرم‌ها
registerAllFormTemplates();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
