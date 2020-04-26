import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import TaskLink from "./TaskLink";

function Header(props) {
  const currentTaskId = "abc123";
  return (
    <Style position="static">
      <h1>
        <Link to="/">Tau Tao</Link>
      </h1>
      <nav>
        <Breadcrumb {...props} />
        <TaskLink taskId={currentTaskId} />
      </nav>
    </Style>
  );
}

export default Header;

const Style = styled.header`
  h1 {
    font-size: 2rem;
    color: purple;
    margin-right: 1rem;
  }

  display: flex;
  align-items: flex-end;
  nav {
    width: 30%;

    display: flex;
    justify-content: space-between;
  }
`;
