import React, { useCallback } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore, HandleChange } from "./StoreContext";
import TaskList from "./TaskList";
import TaskListItem from "./TaskListItem";
import ListItemField from "./ListItemField";
import TaskDetail from "./TaskDetail";
import ElapsedTime from "./ElapsedTime";

const { isNil, not, pipe } = R;

const { prop } = R;

function Task() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];

  const { name, tactics, estimatedPoints, actualPoints, childrenIds } = R.pathOr(
    [],
    basePath,
    state
  );

  const handleChange = useCallback(e => {
    dispatch({
      type: "MERGE_VALUE",
      payload: { targetPath: [...basePath, e.target.name], value: e.target.value },
    });
  }, []);

  const showActions = pipe(isNil)(childrenIds);
  const showTasklist = not(showActions);

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

          <section>
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
            <li>
              <ElapsedTime />
            </li>
          </section>
        </ul>
      </fieldset>
      {showActions && <TaskDetail />}
      {showTasklist && <TaskList label="Tasks" rootIds={childrenIds} basePath={basePath} />}
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

  section {
    display: flex;
  }
`;
