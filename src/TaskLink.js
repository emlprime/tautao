import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useStore } from "./StoreContext";

function TaskLink({ taskId }) {
  const { state } = useStore();
  const { id, name } = R.pathOr({}, ["byId", taskId], state);
  return <Style to={`/task/${id}`}>{name}</Style>;
}

export default TaskLink;

const Style = styled(Link)``;
