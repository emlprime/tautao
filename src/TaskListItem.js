import React, { useContext } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { DataContext } from "./DataContext";
import DnDHandle from "./DnDHandle";
import Points from "./Points";
import Progress from "./Progress";

function TaskListItem({ taskId }) {
  const context = useContext(DataContext);
  const { name } = R.path(["byId", taskId], context);
  return (
    <Style id={`item_${taskId}`}>
      <DnDHandle />
      <Link to={`/task/${taskId}`}>{name}</Link>
      <Points />
      <Progress />
    </Style>
  );
}

export default TaskListItem;

const Style = styled.li`
  width: 100%;
  outline: 1px solid #333;
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  height: 40px;
  display: grid;
  align-items: center;
  grid-template: "dndhandle link points progress"/32px 1fr 32px 32px;
`;
