import React from "react";
import { always, map, unless, isEmpty } from "ramda";
import styled from "styled-components";

function Spacer() {
  return <span>&nbsp;&gt;&nbsp;</span>;
}
function Breadcrumb({ projectName, crumbs = [] }) {
  return (
    <Ul>
      <li>{projectName}</li>
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
