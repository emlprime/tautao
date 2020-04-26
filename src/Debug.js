import React from "react";
import styled from "styled-components";

function Debug({ children: json }) {
  return <Style>{JSON.stringify(json, null, 2)}</Style>;
}

export default Debug;

const Style = styled.pre`
  font-size: 0.5rem;
  color: green;
`;
