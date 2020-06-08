import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import Button from "./Button";
import { calcShowStartAndShowEnd, calcShowDecompose } from "./utils/control";
import { useMachine } from "@xstate/react";
import taskMachine from "./taskMachine";
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
  propOr,
  pipe,
  prop,
  reduce,
  view,
} = R;

let previousStatus;

function Actions() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];
  const itemLens = lensPath(basePath);
  const { previousStatus } = view(itemLens, state);

  const workLogPath = [...basePath, "workLog"];
  const workLog = pathOr([], workLogPath, state);

  const [showStart, showDone] = calcShowStartAndShowEnd(workLog);

  const [current, send, service] = useMachine(taskMachine, { state: previousStatus });

  useEffect(() => {
    service.onTransition(value => {
      dispatch({
        type: "MERGE_VALUE",
        payload: {
          targetPath: [...basePath, "previousStatus"],
          value: assoc("nextEvents", [], value),
        },
      });
    });
  }, [service]);

  const showDecompose = calcShowDecompose(state, id, current.value);

  const actions = ["START", "PAUSE", "RESUME", "BLOCK", "UNBLOCK", "QUIT", "FINISH"];

  const handleStart = useCallback(() => {}, [id, dispatch]);

  const handleDecompose = useCallback(() => {
    dispatch({ type: "DECOMPOSE", id });
  }, [id, dispatch]);
  if (!current) return null;
  return (
    <Style>
      <header>Actions</header>
      <li>
        Status: <pre>{JSON.stringify(prop("value", current))}</pre>
      </li>
      {map(action => {
        const nextEvents = current.nextEvents;
        console.log("nextEvents:", nextEvents);
        return (
          includes(action, nextEvents) && (
            <AnimatePresence key={action}>
              <AnimatedButton
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
