import React from "react";
import styled from "styled-components";
import Actions from "./Actions";
import WorkLog from "./WorkLog";

function TaskDetail() {
  return (
    <Style>
      <Actions />
      <WorkLog />
    </Style>
  );
}

export default TaskDetail;

const Style = styled.section`
  display: flex;
  flex-direction: column;
`;
