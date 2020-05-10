import React, { useCallback, useEffect } from "react";
import * as R from "ramda";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { useStore, getData, putData, postData, persist } from "./StoreContext";
import { formatIds } from "./utils";

const {
  always,
  append,
  assoc,
  converge,
  defaultTo,
  equals,
  identity,
  isNil,
  map,
  not,
  path,
  pipe,
  prop,
  propOr,
  reduce,
} = R;

const getCurrentProject = converge(path, [
  converge(append, [prop("currentProjectId"), always(["byId", "projects"])]),
  identity,
]);

const exists = pipe(
  isNil,
  not
);
const isNotResolved = pipe(
  equals("RESOLVED"),
  not
);
const getIsChanged = pipe(
  prop("mutatedPaths"),
  exists
);

const getIsDirty = pipe(prop("dirtyItemPath"));

const loowiToObj = reduce((acc, item) => assoc(item.id, item, acc), {});

const App = () => {
  const { state, dispatch } = useStore();
  const isChanged = getIsChanged(state);
  const project = getCurrentProject(state);
  const projectName = prop("name", project);
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

  useEffect(() => {
    if (isChanged) {
      const mutatedPaths = propOr([], "mutatedPaths", state);
      console.log("mutatedPaths:", mutatedPaths);
      map(({ model, id }) => {
        const data = path(["byId", model, id], state);
        console.log("data:", data);
        persist(model, id, data);
      }, mutatedPaths);

      dispatch({ type: "PERSISTED_DATA" });
    }
  }, [isChanged, project]);

  const shouldLoadData = pipe(
    prop("byId"),
    isNil
  )(state);

  useEffect(() => {
    if (shouldLoadData) {
      loadData();
    }
  }, [loadData, shouldLoadData]);

  if (isNil(projectName)) {
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
