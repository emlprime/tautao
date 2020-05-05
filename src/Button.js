import React from "react";
import styled from "styled-components";

function Button({ children, handleClick }) {
  return (
    <Style type="button" onClick={handleClick}>
      {children}
    </Style>
  );
}

export default Button;

const Style = styled.button`
  background-color: #000;
  border-color: #333;
  color: #444;
`;
