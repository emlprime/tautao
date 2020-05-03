import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
import dayjs from "dayjs";
const SECRET_KEY = process.env.REACT_APP_JSON_SERVER_SECRET_KEY;

const binRoute = "https:api.jsonbin.io/v3/b/5ea36ee698b3d53752340233";

function putData(data) {
  fetch(binRoute, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-key": SECRET_KEY,
      "X-Bin-Versioning": false
    },
    body: JSON.stringify(data, null, 2)
  });
}

export async function getData() {
  const result = await fetch(`${binRoute}/2`, {
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
      return R.merge(state, { ...action.payload, status: "RESOLVED" });
    case "MERGE_VALUE":
      const { path, value } = action.payload;

      return R.pipe(
        R.assocPath(path, value),
        R.assoc("lastMutation", dayjs())
      )(state);
    case "PERSIST_DATA":
      putData(
        R.pipe(
          R.dissoc("status"),
          R.dissoc("lastMutation")
        )(state)
      );
      return R.assoc("lastMutation", undefined, state);
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
