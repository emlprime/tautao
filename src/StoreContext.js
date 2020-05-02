import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";

const defaultState = { status: "PENDING" };

function reducer(state = defaultState, action = {}) {
  console.log("state:", state);
  switch (action.type) {
    case "MERGE_STATE":
      return R.merge(state, action.payload);
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const value = { state, dispatch };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
