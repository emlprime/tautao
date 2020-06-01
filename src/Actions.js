import React, { useState, useCallback } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import Button from "./Button";
import { calcShowStartAndShowEnd, calcShowDecompose } from "./utils/control";
import { useMachine } from "@xstate/react";
import initTaskMachine from "./taskMachine";
import { motion, AnimatePresence } from "framer-motion";

const {
  __,
  anyPass,
  always,
  assoc,
  curry,
  equals,
  gt,
  has,
  ifElse,
  includes,
  is,
  keys,
  last,
  length,
  lensPath,
  map,
  not,
  pathOr,
  pipe,
  prop,
  reduce,
  view,
} = R;

function Actions() {
  const { id } = useParams();
  const [startStatus, setStartStatus] = useState("open");
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];
  const itemLens = lensPath(basePath);
  const { status } = view(itemLens, state);

  const workLogPath = [...basePath, "workLog"];
  const workLog = pathOr([], workLogPath, state);

  const [showStart, showDone] = calcShowStartAndShowEnd(workLog);
  const [current, send] = useMachine(initTaskMachine(status));
  const showDecompose = calcShowDecompose(state, id, current.value);

  const actions = ["START", "PAUSE", "RESUME", "BLOCK", "UNBLOCK", "QUIT", "FINISH"];

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
      <li>
        Status: <pre>{JSON.stringify(prop("value", current))}</pre>
      </li>
      {map(action => {
        return (
          includes(action, current.nextEvents) && (
            <AnimatePresence>
              <AnimatedButton
                key={action}
                onClick={() => send(action)}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "2rem" }}
                exit={{ opacity: 0, height: "-100%" }}
              >
                {action}
              </AnimatedButton>
            </AnimatePresence>
          )
        );
      }, actions)}

      {showDecompose && (
        <AnimatePresence>
          <AnimatedButton
            onClick={handleDecompose}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "2rem" }}
            exit={{ opacity: 0, height: "-100%" }}
          >
            DECOMPOSE
          </AnimatedButton>
        </AnimatePresence>
      )}
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

const AnimatedButton = styled(motion.button)``;
