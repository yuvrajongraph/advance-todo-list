import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store,{persistor} from "./redux/store.jsx";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { PersistGate } from 'redux-persist/integration/react';
import "react-big-calendar/lib/css/react-big-calendar.css"
import EventState from "./Context/Event/EventState.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <EventState>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </EventState>
        </PersistGate>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
