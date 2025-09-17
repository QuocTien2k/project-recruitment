import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "@redux/store";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { ChatProvider } from "@context/ChatContext";
import "react-datepicker/dist/react-datepicker.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ChatProvider>
          <App />
        </ChatProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
