import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";

function TaskList({ rootIds }) {
  return <Style>{R.map(id => <TaskListItem key={id} taskId={id} />)(rootIds)}</Style>;
}

export default TaskList;

const Style = styled.section``;
