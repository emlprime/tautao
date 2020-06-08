import React from "react";
import * as R from "ramda";
import styled from "styled-components";

const formatChosen = ({ isChosen }) => (isChosen ? "#fff" : "#222");
const formatChosenCursor = ({ isChosen }) => (isChosen ? "default" : "crosshair");
const formatSelectionIndex = R.ifElse(R.pipe(R.is(String)), R.always(""), R.inc);

function Handle({ selectionIndex, ...rest }) {
  return <Style {...rest}>{formatSelectionIndex(selectionIndex)}</Style>;
}
export default Handle;

const Style = styled.div`
  cursor: ${formatChosenCursor};
  background-color: ${formatChosen};
  width: 16px;
  height: 16px;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
`;
