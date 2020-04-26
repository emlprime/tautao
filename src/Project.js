import React, { useContext } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { DataContext } from "./DataContext";
import TaskListItem from "./TaskListItem";
import FieldText from "./FieldText";
import FieldNumber from "./FieldNumber";
import FieldTextMultiline from "./FieldTextMultiline";

function Project({ projectName, goal, strategy, velocity }) {
  const context = useContext(DataContext);
  const rootIds = R.path(["rootIds"], context);

  return (
    <Style>
      <fieldset>
        <ul>
          <FieldText label="Name" name="name" value="foo" />
          <FieldTextMultiline label="Goal" name="goal" value="bar" />
          <FieldTextMultiline label="Strategy" name="strategy" value="blah" />
          <FieldNumber label="Sprint Velocity" name="velocity" value="3" />
        </ul>
      </fieldset>
      <ul>
        <label>Milestones:</label>
        {R.map(id => <TaskListItem key={id} taskId={id} />)(rootIds)}
      </ul>
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

  > ul {
    padding-top: 1rem;
  }

  #velocity {
    width: 100px;
  }
`;
