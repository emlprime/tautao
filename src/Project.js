import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useStore } from "./StoreContext";
import FieldText from "./FieldText";
import FieldNumber from "./FieldNumber";
import FieldTextMultiline from "./FieldTextMultiline";
import TaskList from "./TaskList";

function Project() {
  const { state, dispatch } = useStore();

  const projectId = R.prop("currentProjectId", state);
  const basePath = ["byId", "projects", projectId];
  const { name, goal, strategy, velocity, rootIds } = R.pathOr([], basePath, state);

  const handleChange = e =>
    dispatch({
      type: "MERGE_VALUE",
      payload: { path: [...basePath, e.target.name], value: e.target.value }
    });
  return (
    <Style>
      <fieldset>
        <ul>
          <FieldText label="Name" name="name" value={name} handleChange={handleChange} />
          <FieldTextMultiline label="Goal" name="goal" value={goal} handleChange={handleChange} />
          <FieldTextMultiline
            label="Strategy"
            name="strategy"
            value={strategy}
            handleChange={handleChange}
          />
          <FieldNumber
            label="Sprint Velocity"
            name="velocity"
            value={velocity}
            handleChange={handleChange}
          />
        </ul>
      </fieldset>
      <TaskList rootIds={rootIds} path={[...basePath, "rootIds"]} />
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
