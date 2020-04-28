import React from "react";
import styled from "styled-components";

function Progress() {
  const height = 35;
  const theHeights = {
    doneHeight: parseInt(0.43 * height, 10),
    doingHeight: parseInt(0.34 * height, 10),
    todoHeight: parseInt(0.13 * height, 10)
  };
  return (
    <Style {...theHeights}>
      <div className="done" />
      <div className="doing" />
      <div className="todo" />
    </Style>
  );
}

export default Progress;

const Style = styled.section`
  display: flex;
  width: 32px;
  flex-direction: column;
  .done {
    background-color: maroon;
    height: ${({ doneHeight }) => doneHeight}px;
  }
  .doing {
    background-color: purple;
    height: ${({ doingHeight }) => doingHeight}px;
  }
  .todo {
    background-color: blue;
    height: ${({ todoHeight }) => todoHeight}px;
  }
  font-size: 0.5rem;
  text-align: right;
  span {
    margin-right: 0.4rem;
  }
`;
