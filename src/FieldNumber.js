import React from "react";
import styled from "styled-components";

function FieldNumber({ name, handleChange, ...rest }) {
  return (
    <Input direction="rtl" type="number" id={name} name={name} onChange={handleChange} {...rest} />
  );
}

export default FieldNumber;

const Input = styled.input`
  text-align: right;
  height: 1.2rem;

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    margin: 30px;
  }
`;
