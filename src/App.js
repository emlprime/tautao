import React, { useCallback, useEffect } from "react";
import * as R from "ramda";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { useStore, getData, putData } from "./StoreContext";
import { formatIds } from "./utils";

const defaultToObj = R.defaultTo({});

const getCurrentProject = R.pipe(
  R.converge(R.path, [
    R.converge(R.append, [R.prop("currentProjectId"), R.always(["byId", "projects"])]),
    R.identity,
  ]),
  defaultToObj
);

const exists = R.pipe(
  R.isNil,
  R.not
);
const isNotResolved = R.pipe(
  R.equals("RESOLVED"),
  R.not
);
const isChanged = R.pipe(
  R.prop("lastMutation"),
  exists
);

const loowiToObj = R.reduce((acc, item) => R.assoc(item.id, item, acc), {});

const App = () => {
  const { state, dispatch } = useStore();

  const isPending = isNotResolved(state);
  const loadData = useCallback(async () => {
    if (isPending) {
      const projectData = await getData("projects/abc123");
      const itemsData = await getData("items");

      dispatch({
        type: "MERGE_STATE",
        payload: {
          currentProjectId: "abc123",
          byId: { projects: { abc123: projectData }, items: loowiToObj(itemsData) },
        },
      });
    }
  }, [dispatch, isPending]);

  const persistData = useCallback(data => {
    // console.log("path:", formatIds(R.path(["byId", "projects", "abc123", "rootIds"], data)));
    // console.log("data:", data);
    putData("projects/abc123", R.path(["byId", "projects", "abc123"], data));
  }, []);

  const editDebounceInSec = 2;

  const shouldSetPersistDataTimeout = R.allPass([isChanged, isNotResolved])(state);
  const shouldPersistData = R.equals("PERSIST_DATA", state.status);
  const shouldLoadData = R.pipe(
    R.prop("byId"),
    R.isNil
  )(state);

  useEffect(() => {
    if (shouldPersistData) {
      persistData(state);
    }
  }, [shouldPersistData, persistData, state]);

  useEffect(() => {
    if (shouldSetPersistDataTimeout) {
      const timer = setTimeout(() => {
        dispatch({ type: "PERSIST_DATA" });
      }, editDebounceInSec * 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldSetPersistDataTimeout, editDebounceInSec, dispatch]);

  useEffect(() => {
    if (shouldLoadData) {
      loadData();
    }
  }, [loadData, shouldLoadData]);

  const { name: projectName } = getCurrentProject(state);

  if (R.isNil(projectName)) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Route exact path="/">
        <Header />
      </Route>
      <Route path="/task/:id">
        <Header projectName={projectName} />
      </Route>
      <main>
        <Route exact path="/">
          <Project projectName={projectName} />
        </Route>
        <Route path="/task/:id">
          <Task />
        </Route>
      </main>
    </Router>
  );
};

export default App;
