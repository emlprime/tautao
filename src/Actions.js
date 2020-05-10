import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import Button from "./Button";

const { has, isNil, last, pathOr } = R;

function Actions() {
  const { id } = useParams();
  const [showStart, setShowStart] = useState(false);
  // const [showBlocked, setShowBlocked] = useState(false);

  const { state, dispatch } = useStore();

  const basePath = ["byId", "items", id];
  const workLogPath = [...basePath, "workLog"];

  const workLog = pathOr([], workLogPath, state);

  useEffect(() => {
    const hasWorkLog = isNil(workLog);
    const hasStart = has("startedAtMS", last(workLog));
    const hasEnd = has("endedAtMS", last(workLog));

    if (hasWorkLog || !hasStart || hasEnd) {
      setShowStart(true);
    }
  }, [workLog]);

  const handleStart = useCallback(() => {
    dispatch({ type: "START", id });
  }, [id]);

  const handleDone = useCallback(() => {
    dispatch({ type: "DONE", id });
  }, [id]);

  return (
    <Style>
      <header>Actions</header>

      {showStart && <Button onClick={handleStart}>Start</Button>}
      {!showStart && <Button onClick={handleDone}>Done</Button>}
      {/* {showBlocked && <Button>Blocked</Button>} */}
      <Button>Will Not Do</Button>
      <Button>Decompose</Button>
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
