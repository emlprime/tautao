import React, { useContext } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { DataContext } from "./DataContext";
import DnDHandle from "./DnDHandle";
import Points from "./Points";
import Progress from "./Progress";
import Draggable from "./Draggable";

function TaskListItem({ taskId }) {
  const context = useContext(DataContext);
  const { name } = R.path(["byId", taskId], context);
  return (
    <Draggable onDrag={console.log} onDragEnd={console.log} id={taskId}>
      <Style>
        <DnDHandle />
        <Link to={`/task/${taskId}`}>{name}</Link>
        <Points />
        <Progress />
      </Style>
    </Draggable>
  );
}

export default TaskListItem;

const Style = styled.li`
  outline: 1px solid #ccc;
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  height: 2rem;
  display: grid;
  align-items: center;
  grid-template: "dndhandle link points progress"/32px 1fr 32px 32px;
`;
