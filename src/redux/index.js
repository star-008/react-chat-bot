"use strict";

import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers"; //Import the reducer

// Connect our store to the reducers
export default createStore(reducers);
