import React from "react";
import GlobalStyle from "./GlobalStyle";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Project from "./Project";
import Task from "./Task";
import { DataContext } from "./DataContext";

function App() {
  const projectName = "tau tao";
  const data = {
    byId: {
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
    },
    rootIds: ["abc123", "def234", "task3", "task4", "task5", "task6"]
  };

  return (
    <DataContext.Provider value={data}>
      <Router>
        <GlobalStyle />
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
    </DataContext.Provider>
  );
}

export default App;
