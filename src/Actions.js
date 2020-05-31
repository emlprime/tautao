import React, { useCallback } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import Button from "./Button";
import { calcShowStartAndShowEnd, calcShowDecompose } from "./utils/control";
import { useMachine } from "@xstate/react";
import initTaskMachine from "./taskMachine";

const {
  __,
  anyPass,
  always,
  curry,
  gt,
  has,
  ifElse,
  includes,
  is,
  last,
  length,
  lensPath,
  map,
  not,
  pathOr,
  pipe,
  prop,
  view,
} = R;

const isValidAction = curry((current, action) => includes(action, prop("nextEvents", current)));

function Actions() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];
  const itemLens = lensPath(basePath);
  const { status } = view(itemLens, state);

  const workLogPath = [...basePath, "workLog"];
  const workLog = pathOr([], workLogPath, state);
  const showDecompose = calcShowDecompose(state, id);

  const [showStart, showDone] = calcShowStartAndShowEnd(workLog);
  const [current, send] = useMachine(initTaskMachine(status));
  const actions = ["START", "CLOSE", "PAUSE", "RESUME", "BLOCK", "UNBLOCK", "QUIT", "FINISH"];
  const hasAvailableAction = isValidAction(current);

  const handleStart = useCallback(() => {
    dispatch({ type: "START", id });
  }, [id, dispatch]);

  const handleDone = useCallback(() => {
    dispatch({ type: "DONE", id });
  }, [id, dispatch]);

  const handleDecompose = useCallback(() => {
    dispatch({ type: "DECOMPOSE", id });
  }, [id, dispatch]);

  return (
    <Style>
      <header>Actions</header>
      <li>Status: {prop("value", current)}</li>
      {map(action => {
        return hasAvailableAction(action) ? (
          <Button onClick={() => send(action)}>{action}</Button>
        ) : null;
      }, actions)}

      {showDecompose && <Button onClick={handleDecompose}>Decompose</Button>}
    </Style>
  );
}

export default Actions;

const Style = styled.section`
  width: 100px;
  display: flex;
  flex-direction: column;
  button {
    height: 2rem;
    margin-bottom: 1rem;
  }
`;
