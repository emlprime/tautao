import React from "react";
import styled from "styled-components";

function PointsTotal({ points }) {
  return <Style>{points}</Style>;
}

export default PointsTotal;

const Style = styled.section`
  text-align: right;

  padding-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
