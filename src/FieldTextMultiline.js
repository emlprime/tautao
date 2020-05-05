import React from "react";
import styled from "styled-components";

function FieldTextMultiline({ label, name, handleChange, ...rest }) {
  return <Textarea id={name} name={name} rows={6} onChange={handleChange} {...rest} />;
}

export default FieldTextMultiline;

const Textarea = styled.textarea``;
