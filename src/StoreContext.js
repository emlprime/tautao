import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { formatIds } from "./utils";

const SECRET_KEY = process.env.REACT_APP_JSON_SERVER_SECRET_KEY;
// const binRoute = "https:api.jsonbin.io/v3/b/5ea36ee698b3d53752340233";
const url = "http://localhost:4000";

const handleResponse = R.curry(async (method, path, body = undefined) => {
  const result = await fetch(path, {
    method,
    body,
    headers: { "Content-Type": "application/json" }
  });

  return await result.json();
});

const get = handleResponse("GET");
const put = handleResponse("PUT");

export const getData = path => get(`${url}/${path}`);
export const putData = (path, body) => put(`${url}/${path}`, JSON.stringify(body, null, 2));

const defaultState = { status: "PENDING" };

function reducer(state = {}, action) {
  switch (action.type) {
    case "MERGE_STATE":
      return R.merge(state, { ...action.payload, status: "RESOLVED" });
    case "MERGE_VALUE":
      const { path, value } = action.payload;

      const newState = R.pipe(
        R.assocPath(path, value),
        R.assoc("lastMutation", dayjs().toISOString())
      )(state);

      return newState;
    case "PERSIST_DATA":
      return R.pipe(
        R.assoc("status", "PERSIST_DATA"),
        R.dissoc("lastMutation")
      )(state);
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const fakeDispatch = stuff => console.log("stuff:", stuff);
  const value = { state, dispatch, fakeDispatch };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
