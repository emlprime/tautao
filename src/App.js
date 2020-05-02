import React, { useCallback, useEffect } from "react";
import * as R from "ramda";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { useStore } from "./StoreContext";

const defaultToObj = R.defaultTo({});

const getCurrentProject = R.pipe(
  R.converge(R.path, [
    R.converge(R.append, [R.prop("currentProjectId"), R.always(["byId", "projects"])]),
    R.identity
  ]),
  defaultToObj
);

function App() {
  const data = {
    byId: {
      projects: {
        abc123: {
          name: "tau tao"
        }
      },
      items: {
        abc123: {
          id: "abc123",
          name: "foo",
          taskIds: ["xyz345", "wer343"]
        },
        def234: {
          id: "def234",
          name: "bar",
          taskIds: ["jkl234", "dfw432"]
        },
        xyz345: { id: "xyz345", name: "blah", points: 2 },
        wer343: { id: "wer343", name: "stuff", points: 3 },
        jkl234: { id: "jkl234", name: "foobar", points: 5 },
        dfw432: { id: "dfw432", name: "things", points: 2 },
        task3: { id: "task3", name: "task3" },
        task4: { id: "task4", name: "task4" },
        task5: { id: "task5", name: "task5" },
        task6: { id: "task6", name: "task6" }
      }
    },
    rootIds: ["abc123", "def234", "task3", "task4", "task5", "task6"],
    currentProjectId: "abc123"
  };

  const { state, dispatch } = useStore();

  const loadData = useCallback(() => {
    dispatch({ type: "MERGE_STATE", payload: data });
  }, [dispatch, data]);

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
  console.log("projectName:", projectName);
  if (R.isNil(projectName)) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Route exact path="/">
        <Header projectName={projectName} />
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
