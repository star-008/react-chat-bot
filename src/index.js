import React from "react";
import ReactDOM from "react-dom";
import "./Styles/index.css";
import App from "./Components/App";
import { Provider } from "react-redux";
import store from "./redux";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/dashmix.min.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker();
