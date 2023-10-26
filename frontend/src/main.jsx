import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store,{persistor} from "./redux/store.jsx";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </PersistGate>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
