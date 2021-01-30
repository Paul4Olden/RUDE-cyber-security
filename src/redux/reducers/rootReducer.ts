import { combineReducers } from "redux";
import selectorsReducer from "./selectorsReducer";

const rootReducer = combineReducers({
  selectors: selectorsReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;