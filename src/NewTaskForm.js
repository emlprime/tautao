import React from "react";
import styled from "styled-components";
import FieldText from "./FieldText";
import FieldNumber from "./FieldNumber";

function NewTaskForm() {
  return (
    <Style>
      <FieldText placeholder="Name..." />
      <FieldNumber placeholder="Pts" />
    </Style>
  );
}

export default NewTaskForm;

const Style = styled.section`
  grid-template: "name points" 1fr/ 2fr 1fr;
`;
