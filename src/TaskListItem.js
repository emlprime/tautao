import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useStore } from "./StoreContext";
import DnDHandle from "./DnDHandle";
import Points from "./Points";
import Progress from "./Progress";

function TaskListItem({ taskId }) {
  const { state } = useStore();
  const { name, points } = R.path(["byId", R.prop("model", taskId), R.prop("id", taskId)], state);
  return (
    <Style id={`item_${taskId}`}>
      <DnDHandle />
      <Link to={`/task/${taskId}`}>{name}</Link>
      <Totals>
        <Points points={points} />
        <Progress />
      </Totals>
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

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
  margin-right: 6px;
`;
