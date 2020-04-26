import React from "react";
import styled from "styled-components";

function FieldNumber({ label, name, value, max, min = 1 }) {
  return (
    <Style>
      <label>{label}:</label>
      <input type="number" id={name} name={name} value={value} min={min} max={max} />
    </Style>
  );
}

export default FieldNumber;

const Style = styled.li`
  input {
    text-align: right;
  }
`;
