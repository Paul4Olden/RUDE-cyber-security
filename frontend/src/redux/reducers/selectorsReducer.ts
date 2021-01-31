import { SHOW_NULLS, HIDE_NULLS } from "../actionTypes";

const initialState = {
  showNulls: false,
};

const selectorsReducer = (state = initialState, action: { type: string }) => {
  switch (action.type) {
    case SHOW_NULLS: {
      console.log(SHOW_NULLS)
      return {
        ...state,
        showNulls: true,
      }
    }
    case HIDE_NULLS: {
      console.log(HIDE_NULLS)
      return {
        ...state,
        showNulls: false,
      }
    }
    default: {
      return state;
    }
  }
};

export default selectorsReducer;
