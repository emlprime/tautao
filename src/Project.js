import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Project() {
  return (
    <Style>
      <ul>
        <li>
          <Link to="task/abc123">Milestone1</Link>
        </li>
        <li>
          <Link to="task/def234">Milestone2</Link>
        </li>
      </ul>
    </Style>
  );
}

export default Project;

const Style = styled.section``;
