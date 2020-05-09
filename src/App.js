import React, { useCallback, useEffect } from "react";
import * as R from "ramda";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { useStore, getData, putData, postData } from "./StoreContext";
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

const isDirty = R.pipe(R.prop("dirtyItemPath"));

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

  const shouldLoadData = R.pipe(
    R.prop("byId"),
    R.isNil
  )(state);

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
