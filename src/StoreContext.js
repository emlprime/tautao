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

const serviceGet = handleResponse("GET");
const servicePut = handleResponse("PUT");
const servicePost = handleResponse("POST");
const serviceDelete = handleResponse("DELETE");

export const getData = path => serviceGet(`${url}/${path}`);
export const deleteData = path => serviceDelete(`${url}/${path}`);
export const putData = (path, body) => servicePut(`${url}/${path}`, JSON.stringify(body, null, 2));
export const postData = (path, body) =>
  servicePost(`${url}/${path}`, JSON.stringify(body, null, 2));

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
  return pipe(
    over(listLens, append(newItem)),
    assocPath(newItemPath, newItemData),
    markAsDirty
  )(data);
}

export async function handleNewOrder(setPath, data, reoderedIds) {
  const listLens = lensPath(setPath);
  return pipe(
    set(listLens, reoderedIds),
    markAsDirty
  )(data);
}

export async function handleDeleteItem(rootIdsPath, data, id) {
  deleteData(`items/${id}`);
  const listLens = lensPath(rootIdsPath);
  const deletedItemPath = ["byId", "items", id];
  return pipe(
    over(listLens, reject(propEq("id", id))),
    dissocPath(deletedItemPath),
    markAsDirty
  )(data);
}

export async function persistProject(projectData) {
  const id = prop("id", projectData);
  return await putData(`projects/${id}`, projectData);
}

function reducer(state = {}, action) {
  switch (action.type) {
    case "MERGE_STATE":
      return R.merge(state, { ...action.payload, status: "RESOLVED" });
    case "MERGE_VALUE":
      const { targetPath, value } = action.payload;
      if (!targetPath) {
        console.log("target path to set:", value);
      }

      const newState = R.pipe(
        R.assocPath(targetPath, value),
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

    case "PERSISTED_DATA":
      return R.pipe(R.dissoc("lastMutation"))(state);
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
