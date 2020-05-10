import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import TaskList from "./TaskList";
import TaskListItem from "./TaskListItem";
import ListItemField from "./ListItemField";

const { prop } = R;

function Task() {
  const { id } = useParams();

  const { state, dispatch } = useStore();

  const basePath = ["byId", "items", id];

  const { name, tactics, estimatedPoints, actualPoints, childrenIds = [] } = R.pathOr(
    [],
    basePath,
    state
  );

  const handleChange = e =>
    dispatch({
      type: "MERGE_VALUE",
      payload: { targetPath: [...basePath, e.target.name], value: e.target.value },
    });

  return (
    <Style>
      <fieldset>
        <ul>
          <ListItemField
            type="text"
            label="Name"
            name="name"
            value={name}
            handleChange={handleChange}
          />
          <ListItemField
            type="multiline"
            label="Tactics"
            name="tactics"
            value={tactics}
            handleChange={handleChange}
          />
          <ListItemField
            id="estimatedPoints"
            type="number"
            label="Estimated Points"
            name="estimatedPoints"
            value={estimatedPoints}
            handleChange={handleChange}
          />
          <ListItemField
            id="actualPoints"
            type="number"
            label="Actual"
            name="actualPoints"
            value={actualPoints}
            handleChange={handleChange}
          />
        </ul>
      </fieldset>
      <TaskList label="Tasks" rootIds={childrenIds} basePath={basePath} />
    </Style>
  );
}

export default Task;

const Style = styled.section`
  display: grid;

  grid-template: "form milestones" 80vh / 1fr 1fr;
  fieldset li {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  #estimatedPoints,
  #actualPoints {
    width: 100px;
  }
`;
