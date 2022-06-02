import { configureStore } from "@reduxjs/toolkit";

import operatorsReducer from "./operators";
import authReducer from "./auth";

const store = configureStore({
  reducer: { operators: operatorsReducer, auth: authReducer },
});

export default store;
