import React, { useContext } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { DataContext } from "./DataContext";

function TaskListItem({ taskId }) {
  const context = useContext(DataContext);
  const { name } = R.path(["byId", taskId], context);
  return (
    <Style>
      <Link to={`/task/${taskId}`}>{name}</Link>
    </Style>
  );
}

export default TaskListItem;

const Style = styled.li``;
