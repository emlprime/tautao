import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Debug from "./Debug";

function Task() {
  const { taskId } = useParams();
  return <Style>{taskId}</Style>;
}

export default Task;

const Style = styled.section``;
