import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useStore } from "./StoreContext";
import Handle from "./Handle";
import Points from "./Points";
import Progress from "./Progress";
import Button from "./Button";

const formatChosen = ({ selectionIndex }) => (R.not(R.isEmpty(selectionIndex)) ? "#aaa" : "#111");

function TaskListItem({ taskId, selectionIndex, handleClick, handleDeleteItemClick }) {
  const { state } = useStore();
  const id = R.prop("id", taskId);

  const item = R.path(["byId", R.prop("model", taskId), id], state);
  const name = R.prop("name", item);
  const points = R.prop("points", item);

  const counts = { todoCount: 1, doingCount: 3, doneCount: 1 };

  return (
    <Style id={`item_${id}`} selectionIndex={selectionIndex}>
      <Handle onClick={() => handleClick(taskId)} selectionIndex={selectionIndex} />
      <Link to={`/task/${id}`}>{name}</Link>

      <Points points={points} />
      <Progress counts={counts} />

      <Button handleClick={() => handleDeleteItemClick(id)}>X</Button>
    </Style>
  );
}

export default TaskListItem;

const Style = styled.li`
  width: 100%;
  background-color: ${formatChosen};
  margin: 0 0.2rem 0.2rem 0;
  padding-left: 0.5rem;
  display: grid;
  align-items: center;
  grid-template-columns: 32px 1fr 32px 32px 32px;
  grid-gap: 4px;

  button {
    border-radius: 100%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
