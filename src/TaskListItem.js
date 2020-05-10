import React, { useCallback } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useStore } from "./StoreContext";
import Handle from "./Handle";
import Points from "./Points";
import Progress from "./Progress";
import Button from "./Button";
import FieldText from "./FieldText";

const formatChosen = ({ selectionIndex }) => (R.not(R.isEmpty(selectionIndex)) ? "#aaa" : "#111");

function TaskListItem({ taskId, selectionIndex, handleClick, handleDeleteItemClick }) {
  const { state, dispatch } = useStore();
  const id = R.prop("id", taskId);
  const basePath = ["byId", R.prop("model", taskId), id];
  const item = R.path(basePath, state);
  const name = R.prop("name", item);
  const points = R.prop("estimatedPoints", item);

  const counts = { todoCount: 1, doingCount: 3, doneCount: 1 };

  const handleChange = useCallback(
    e => {
      dispatch({
        type: "MERGE_VALUE",
        payload: { targetPath: [...basePath, e.target.name], value: e.target.value },
      });
    },
    [dispatch, basePath]
  );

  return (
    <Style id={`item_${id}`} selectionIndex={selectionIndex}>
      <Handle onClick={() => handleClick(taskId)} selectionIndex={selectionIndex} />
      <Link to={`/task/${id}`}>
        <span role="img" aria-label="View Detail">
          &#128269;
        </span>
      </Link>
      <FieldText {...{ id: "name", name: "name", value: name, handleChange }} />
      <RightContent>
        <Points {...{ value: points, handleChange }} />
        <Progress counts={counts} />
        <Button handleClick={() => handleDeleteItemClick(id)}>X</Button>
      </RightContent>
    </Style>
  );
}

export default TaskListItem;

const Style = styled.li`
  background-color: ${formatChosen};
  margin: 0 0.2rem 0.2rem 0;
  padding-left: 0.5rem;
  display: grid;
  align-items: center;
  grid-template-columns: 32px 32px 1fr 128px;
  grid-gap: 4px;

  input {
    background-color: #111;
    :hover {
      background-color: #333;
    }
    ::selection {
      color: #000;
      background-color: #ccc;
    }
  }
`;

const RightContent = styled.section`
  display: grid;
  grid-template-columns: 64px 32px 32px;
  grid-gap: 4px;
  button {
    border-radius: 100%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  align-items: center;
`;
