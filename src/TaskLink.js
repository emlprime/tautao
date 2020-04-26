import React, { useContext } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { DataContext } from "./DataContext";

function TaskLink({ taskId }) {
  const context = useContext(DataContext);
  const { id, name } = R.path(["byId", taskId], context);
  return <Style to={`/task/${id}`}>{name}</Style>;
}

export default TaskLink;

const Style = styled(Link)``;
