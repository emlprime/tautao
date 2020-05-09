import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const {
  allPass,
  append,
  assoc,
  assocPath,
  curry,
  dissocPath,
  lensPath,
  over,
  path,
  pipe,
  prop,
  propEq,
  reduce,
  reject,
  set,
  tap,
  view,
} = R;

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
const post = handleResponse("POST");

export const getData = path => get(`${url}/${path}`);
export const putData = (path, body) => put(`${url}/${path}`, JSON.stringify(body, null, 2));
export const postData = (path, body) => post(`${url}/${path}`, JSON.stringify(body, null, 2));

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

export async function handleNewItem(setPath, data, item) {
  // create item in the database
  const response = await postData("items", item);

  // get the new id
  const newItemId = prop("id", response);
  const newItem = { id: newItemId, model: "items" };
  const newItemData = { ...item, id: newItemId };

  const listLens = lensPath(setPath);
  const newItemPath = ["byId", "items", newItemId];
  const result = pipe(
    over(listLens, append(newItem)),
    assocPath(newItemPath, newItemData)
  )(data);
  console.log("result:", result);
  return result;
}

function reducer(state = {}, action) {
  switch (action.type) {
    case "MERGE_STATE":
      return R.merge(state, { ...action.payload, status: "RESOLVED" });
    case "MERGE_STATE_NEW":
      const { payload: newItemState } = action;

      const result = pipe(markAsDirty)(newItemState);
      console.log("result:", JSON.stringify(result, null, 2));
      return result;
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
  const value = { state, dispatch };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
