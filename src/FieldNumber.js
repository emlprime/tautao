import React from "react";
import styled from "styled-components";

function FieldNumber({ name, handleChange, ...rest }) {
  return <Input type="number" id={name} name={name} onChange={handleChange} {...rest} />;
}

export default FieldNumber;

const Input = styled.input`
  text-align: right;
  height: 1.2rem;
`;
