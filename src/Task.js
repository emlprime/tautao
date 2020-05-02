import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import TaskListItem from "./TaskListItem";

const handleChange = e => console.log("e:", e.target.value);

function Task() {
  const { taskId } = useParams();
  const { state } = useStore();
  const { name, taskIds = [] } = R.path(["byId", taskId], state);

  return (
    <Style>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" value={name} onChange={handleChange} />
      {R.unless(R.isEmpty, ids => (
        <ul>{R.map(id => <TaskListItem key={id} taskId={id} />)(ids)}</ul>
      ))(taskIds)}
    </Style>
  );
}

export default Task;

const Style = styled.section``;
