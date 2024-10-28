import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers/index";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.css";
import "./index.css";
import App from "./App";

const store = createStore(rootReducer);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
