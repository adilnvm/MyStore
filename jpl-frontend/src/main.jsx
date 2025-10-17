import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
