import React from "react";
import GlobalStyle from "./GlobalStyle";
import Header from "./Header";

function App() {
  const projectName = "tau tao";
  const crumbs = [
    { id: 1, name: "Layout Page" },
    { id: 2, name: "Breadcrumb" },
    { id: 3, name: "Breadcrumb Item" }
  ];
  return (
    <div>
      <GlobalStyle />
      <Header projectName={projectName} crumbs={crumbs} />

      <main>Main</main>
    </div>
  );
}

export default App;
