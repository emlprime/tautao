import React from "react";
import styled from "styled-components";

function FieldTextMultiline({ label, name, value }) {
  return (
    <Style>
      <label>{label}:</label>
      <textarea id={name} name={name} value={value} rows={6} />
    </Style>
  );
}

export default FieldTextMultiline;

const Style = styled.li``;
