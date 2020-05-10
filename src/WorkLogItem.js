import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

function WorkLogItem({ children: time }) {
  return time ? dayjs(time).format("h:mm A") : <Style>WORKING...</Style>;
}

export default WorkLogItem;

const Style = styled.span`
  color: #33f;
`;
