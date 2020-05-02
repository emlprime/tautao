import React, { useCallback, useEffect, useState } from "react";
import * as R from "ramda";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { useStore, getData } from "./StoreContext";

const defaultToObj = R.defaultTo({});

const getCurrentProject = R.pipe(
  R.converge(R.path, [
    R.converge(R.append, [R.prop("currentProjectId"), R.always(["byId", "projects"])]),
    R.identity
  ]),
  defaultToObj
);

function App() {
  const [status, setStatus] = useState("pending");
  const { state, dispatch } = useStore();

  const loadData = useCallback(async () => {
    if (status !== "resolved") {
      const data = await getData();
      dispatch({ type: "MERGE_STATE", payload: data });
      setStatus("resolved");
    }
  }, [dispatch, status]);

  useEffect(() => {
    R.ifElse(
      R.pipe(
        R.prop("byId"),
        R.isNil
      ),
      loadData,
      R.always("some data")
    )(state);
  }, [state, loadData]);

  const { name: projectName } = getCurrentProject(state);

  if (R.isNil(projectName)) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Route exact path="/">
        <Header />
      </Route>
      <Route path="/task/:taskId">
        <Header projectName={projectName} />
      </Route>
      <main>
        <Route exact path="/">
          <Project projectName={projectName} />
        </Route>
        <Route path="/task/:taskId">
          <Task />
        </Route>
      </main>
    </Router>
  );
}

export default App;
