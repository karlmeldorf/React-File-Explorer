import { combineReducers, createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import treeSlice from "./slices/treeSlice";

const rootReducer = combineReducers({
  tree: treeSlice,
});

const store = createStore(rootReducer, composeWithDevTools());
export default store;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
