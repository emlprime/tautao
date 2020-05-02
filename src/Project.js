import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useStore } from "./StoreContext";
import FieldText from "./FieldText";
import FieldNumber from "./FieldNumber";
import FieldTextMultiline from "./FieldTextMultiline";
import TaskList from "./TaskList";

function Project() {
  const { state } = useStore();
  console.log("state:", state);
  const projectId = R.prop("currentProjectId", state);
  const { name, goal, strategy, velocity, rootIds } = R.pathOr(
    [],
    ["byId", "projects", projectId],
    state
  );
  console.log("rootIds:", rootIds);

  const handleChange = () => null;
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
      <TaskList rootIds={rootIds} />
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
