import React from "react";
import * as R from "ramda";
import styled from "styled-components";
import FieldText from "./FieldText";
import FieldTextMultiline from "./FieldTextMultiline";
import FieldNumber from "./FieldNumber";

function ListItemField({ type, label, ...rest }) {
  const fieldtypes = {
    text: FieldText,
    multiline: FieldTextMultiline,
    number: FieldNumber,
  };

  const Component = fieldtypes[type];

  return (
    <Style>
      {label && <label>{label}:</label>}
      <Component {...rest} />
    </Style>
  );
}

export default ListItemField;

const Style = styled.li``;
