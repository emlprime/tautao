import React, { useContext } from "react";
import { always, map, unless, isEmpty } from "ramda";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { DataContext } from "./DataContext";

function Spacer() {
  return <span>&nbsp;&gt;&nbsp;</span>;
}
function Breadcrumb({ projectName, crumbs = [] }) {
  const { taskId } = useParams();
  const context = useContext(DataContext);
  console.log("context:", context, taskId);

  return (
    <Ul>
      <li>
        <Link to="/">{projectName}</Link>
      </li>
      {map(
        ({ id, name }) => (
          <li key={id}>
            <Spacer />
            {name}
          </li>
        ),
        crumbs
      )}
    </Ul>
  );
}

export default Breadcrumb;

const Ul = styled.ul`
  display: flex;
  li {
    padding: 0 0.1rem;
  }
`;
