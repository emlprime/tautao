import React, { useCallback } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import Button from "./Button";
import { calcShowStartAndShowEnd } from "./utils/control";

const { __, always, gt, has, ifElse, last, length, lensPath, not, pathOr, pipe, prop, view } = R;

function Actions() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];
  const itemLens = lensPath(basePath);
  const item = view(itemLens, state);
  const workLogPath = [...basePath, "workLog"];
  const workLog = pathOr([], workLogPath, state);
  const showDecompose = not(has("items", item));

  const [showStart, showDone] = calcShowStartAndShowEnd(workLog);

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

      {showStart && <Button onClick={handleStart}>Start</Button>}
      {showDone && <Button onClick={handleDone}>Done</Button>}
      {/* {showBlocked && <Button>Blocked</Button>} */}
      <Button>Will Not Do</Button>
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
