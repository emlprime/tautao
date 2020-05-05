import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useStore } from "./StoreContext";
import Handle from "./Handle";
import Points from "./Points";
import Progress from "./Progress";

const formatChosen = ({ selectionIndex }) => (R.not(R.isEmpty(selectionIndex)) ? "#aaa" : "#111");

function TaskListItem({ taskId, selectionIndex, handleClick }) {
  const { state } = useStore();
  const id = R.prop("id", taskId);
  const { name, points } = R.path(["byId", R.prop("model", taskId), id], state);

  const counts = { todoCount: 1, doingCount: 3, doneCount: 1 };

  return (
    <Style id={`item_${id}`} selectionIndex={selectionIndex}>
      <Handle onClick={() => handleClick(taskId)} selectionIndex={selectionIndex} />
      <Link to={`/task/${id}`}>{name}</Link>
      <Totals>
        <Points points={points} />
        <Progress counts={counts} />
      </Totals>
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
  grid-template: "handle link points progress"/32px 1fr 32px 32px;
`;

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
  margin-right: 6px;
`;
