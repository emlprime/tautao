import React from "react";
import styled from "styled-components";

function FieldText({ label, name, value, handleChange }) {
  return (
    <Style>
      <label>{label}:</label>
      <input type="text" id={name} name={name} value={value} onChange={handleChange} />
    </Style>
  );
}

export default FieldText;

const Style = styled.li``;
