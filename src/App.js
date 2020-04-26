import React from "react";
import GlobalStyle from "./GlobalStyle";
import { BrowserRouter as Router, Switch, Route, useRouteMath } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { DataContext } from "./DataContext";

function App() {
  const projectName = "tau tao";
  const crumbs = [
    { id: 1, name: "Layout Page" },
    { id: 2, name: "Breadcrumb" },
    { id: 3, name: "Breadcrumb Item" }
  ];
  const data = {
    byId: {
      abc123: {
        name: "foo",
        taskIds: ["xyz345", "wer343"]
      },
      def234: {
        name: "bar",
        taskIds: ["jkl234", "dfw432"]
      },
      xyz345: { name: "blah" },
      wer343: { name: "stuff" },
      jkl234: { name: "foobar" },
      dfw432: { name: "things" }
    },
    rootIds: ["foo", "bar"]
  };

  return (
    <DataContext.Provider value={data}>
      <Router>
        <GlobalStyle />
        <Route path="/task/:taskId">
          <Header projectName={projectName} crumbs={crumbs} />
        </Route>
        <main>
          <Route exact path="/">
            <Project />
          </Route>
          <Route path="/task/:taskId">
            <Task />
          </Route>
        </main>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
