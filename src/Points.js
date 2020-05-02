import React from "react";
import styled from "styled-components";

function Points({ points }) {
  return <Style>{points}</Style>;
}

export default Points;

const Style = styled.section`
  position: relative;
  width: 32px;
  text-align: right;
  align-self: center;
`;
