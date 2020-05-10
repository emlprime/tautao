import React from "react";
import styled from "styled-components";
import FieldNumber from "./FieldNumber";

function Points(params) {
  return (
    <FieldNumber
      placeholder="Pts"
      {...{ id: "estimatedPoints", name: "estimatedPoints", ...params }}
    />
  );
}

export default Points;

const Style = styled.section`
  position: relative;
  width: 32px;
  text-align: right;
  align-self: center;
`;
