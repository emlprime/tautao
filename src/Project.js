import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useStore } from "./StoreContext";
import TaskList from "./TaskList";
import ListItemField from "./ListItemField";

function Project() {
  const { state, dispatch } = useStore();

  const projectId = R.prop("currentProjectId", state);
  const basePath = ["byId", "projects", projectId];
  const { name, goal, strategy, velocity, rootIds } = R.pathOr([], basePath, state);

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
            label="Goal"
            name="goal"
            value={goal}
            handleChange={handleChange}
          />
          <ListItemField
            type="multiline"
            label="Strategy"
            name="strategy"
            value={strategy}
            handleChange={handleChange}
          />
          <ListItemField
            type="number"
            label="Sprint Velocity"
            name="velocity"
            value={velocity}
            handleChange={handleChange}
          />
        </ul>
      </fieldset>
      <TaskList label="Milestones" rootIds={rootIds} basePath={basePath} />
    </Style>
  );
}

export default Project;

const Style = styled.section`
  display: grid;

  grid-template: "form milestones" 80vh / 1fr 1fr;
  fieldset li {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  #velocity {
    width: 100px;
  }
`;
