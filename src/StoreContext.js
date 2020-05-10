import React, { createContext, useReducer, useContext } from "react";
import * as R from "ramda";
import dayjs from "dayjs";

const {
  __,
  allPass,
  always,
  append,
  assocPath,
  curry,
  dissocPath,
  gt,
  identity,
  ifElse,
  is,
  isNil,
  length,
  lensPath,
  over,
  path,
  pipe,
  prop,
  propEq,
  reduce,
  reject,
  set,
  slice,
  subtract,
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

const mutatedLens = lensPath(["mutatedPaths"]);

const safeAppend = curry((setLens, targetState, item) =>
  pipe(
    ifElse(
      pipe(
        view(setLens),
        isNil
      ),
      set(setLens, [item]),
      over(setLens, append(item))
    )
  )(targetState)
);

const safeArray = ifElse(is(Array), identity, Array);

const addToStateArray = curry((setLens, items, targetState) =>
  reduce(safeAppend(setLens), targetState, safeArray(items))
);
const markAsDirty = addToStateArray(mutatedLens);

const getModelAndIdFromPath = slice(1, 3);

export async function handleNewItem(setPath, data, item) {
  // create item in the database
  const response = await postData("items", item);
  const projectId = path([2], setPath);

  // get the new id
  const newItemId = prop("id", response);
  const newItem = { id: newItemId, model: "items" };
  const newItemData = { ...item, id: newItemId };

  const listLens = lensPath(setPath);
  const newItemPath = ["byId", "items", newItemId];
  return pipe(
    over(listLens, append(newItem)),
    assocPath(newItemPath, newItemData),
    markAsDirty({ model: "items", id: newItemId }),
    markAsDirty({ model: "projects", id: projectId })
  )(data);
}

export async function handleNewOrder(setPath, data, reoderedIds) {
  const listLens = lensPath(setPath);
  const [model, id] = getModelAndIdFromPath(setPath);

  return pipe(
    set(listLens, reoderedIds),
    markAsDirty({ model, id })
  )(data);
}

export async function handleDeleteItem(rootIdsPath, data, id) {
  deleteData(`items/${id}`);
  const listLens = lensPath(rootIdsPath);
  const deletedItemPath = ["byId", "items", id];
  const projectId = path([2], rootIdsPath);

  return pipe(
    over(listLens, reject(propEq("id", id))),
    dissocPath(deletedItemPath),
    markAsDirty({ model: "projects", id: projectId })
  )(data);
}

export async function persist(model, id, data) {
  return await putData(`${model}/${id}`, data);
}

export function handleStart(state, action) {
  const id = prop("id", action);
  const itemPath = ["byId", "items", id];
  const workLogLens = lensPath([...itemPath, "workLog"]);

  return pipe(
    over(workLogLens, append({ startedAtMS: +dayjs() })),
    markAsDirty({ model: "items", id })
  )(state);
}

export function handleDone(state, action) {
  const id = prop("id", action);
  const itemPath = ["byId", "items", id];
  const workLogPath = [...itemPath, "workLog"];
  const workLogLens = lensPath([...itemPath, "workLog"]);

  const lastIndex = pipe(
    view(workLogLens),
    length,
    ifElse(gt(1), always(0), subtract(__, 1))
  )(state);
  const lastWorkLog = lensPath([...workLogPath, lastIndex, "endedAtMS"]);
  return pipe(
    set(lastWorkLog, +dayjs()),
    markAsDirty({ model: "items", id })
  )(state);
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

      const [model, id] = getModelAndIdFromPath(targetPath);

      const newState = R.pipe(
        R.assocPath(targetPath, value),
        markAsDirty({ model, id })
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
      return R.dissoc("lastMutation")(state);
    case "START":
      return handleStart(state, action);
    case "DONE":
      return handleDone(state, action);
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
