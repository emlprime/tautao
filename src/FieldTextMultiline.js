import React from "react";
import styled from "styled-components";

function FieldTextMultiline({ label, name, value, handleChange }) {
  return (
    <Style>
      <label>{label}:</label>
      <textarea id={name} name={name} value={value} rows={6} onChange={handleChange} />
    </Style>
  );
}

export default FieldTextMultiline;

const Style = styled.li``;
