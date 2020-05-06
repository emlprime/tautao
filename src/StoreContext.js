import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
import dayjs from "dayjs";

const { lensPath, pipe, assoc, curry, reject, allPass, propEq, view, set, dissocPath } = R;

const url = "http://localhost:4000";

const handleResponse = R.curry(async (method, path, body = undefined) => {
  const result = await fetch(path, {
    method,
    body,
    headers: { "Content-Type": "application/json" },
  });

  return await result.json();
});

const get = handleResponse("GET");
const put = handleResponse("PUT");

export const getData = path => get(`${url}/${path}`);
export const putData = (path, body) => put(`${url}/${path}`, JSON.stringify(body, null, 2));

const defaultState = { status: "PENDING" };

function deleteListItem({ state, path, id }) {
  const itemsLens = lensPath(path);

  const rejectItem = curry(taskId =>
    reject(
      allPass([propEq("id", taskId.id), propEq("model", taskId.model)]),
      view(itemsLens, state)
    )
  );

  return set(itemsLens, rejectItem(id), state);
}

function deleteById({ state, id: { id, model } }) {
  const deletePath = ["byId", model, id];
  return dissocPath(deletePath, state);
}

const markAsDirty = R.assoc("lastMutation", dayjs().toISOString());

function reducer(state = {}, action) {
  switch (action.type) {
    case "MERGE_STATE":
      return R.merge(state, { ...action.payload, status: "RESOLVED" });
    case "MERGE_VALUE":
      const { path, value } = action.payload;

      const newState = R.pipe(
        R.assocPath(path, value),
        markAsDirty
      )(state);

      return newState;
    case "DELETE_LIST_ITEM":
      return pipe(
        deleteListItem,
        markAsDirty
      )({ state, ...action.payload });

    case "DELETE_BY_ID":
      return pipe(
        deleteById,
        markAsDirty
      )({ state, id: action.payload });

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
