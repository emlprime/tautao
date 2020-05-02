import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
const SECRET_KEY = process.env.REACT_APP_JSON_SERVER_SECRET_KEY;

function putData(data) {
  fetch("https://api.jsonbin.io/v3/b/5ead26e107d49135ba493ca9", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-key": SECRET_KEY
    },
    body: JSON.stringify(data, null, 2)
  });
}

export async function getData() {
  const result = await fetch("https:api.jsonbin.io/v3/b/5ea36ee698b3d53752340233/2", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Master-key": SECRET_KEY
    }
  });

  const response = await result.json();
  const { record: data } = response;

  return data;
}

const defaultState = { status: "PENDING" };

function reducer(state = defaultState, action = {}) {
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
