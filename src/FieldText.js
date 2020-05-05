import React from "react";
import styled from "styled-components";

function FieldText({ name, handleChange, ...rest }) {
  return <Input type="text" id={name} name={name} onChange={handleChange} {...rest} />;
}

export default FieldText;

const Input = styled.input`
  height: 1.2rem;
  margin-right: 0.2rem;
`;
