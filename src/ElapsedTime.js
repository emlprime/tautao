import React, { useState, useEffect } from "react";
import sprintf from "sprintf";
import styled from "styled-components";
import * as R from "ramda";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import useInterval from "./useInterval";
const {
  add,
  has,
  last,
  lensIndex,
  map,
  merge,
  modulo,
  multiply,
  not,
  pipe,
  prop,
  pathOr,
  reduce,
  subtract,
  view,
} = R;

const diffReducer = (acc, [startTime, recordedEndTime]) => {
  const endTime = recordedEndTime || +dayjs();
  return add(acc, subtract(endTime, startTime));
};

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

const unitsReducer = (acc, [unit, amount]) => {
  const remaining = prop("remaining", acc);
  if (remaining <= 0) {
    return acc;
  }
  const unitAmount = parseInt(remaining / amount, 10);
  const newRemaining = remaining - multiply(unitAmount, amount);
  return merge(acc, { remaining: newRemaining, [unit]: unitAmount });
};
const timeUnits = [
  ["days", day],
  ["hours", hour],
  ["minutes", minute],
  ["seconds", second],
  ["milliseconds", 1],
];

function formatDisplay(remaining) {
  const subdividedUnits = reduce(unitsReducer, { remaining }, timeUnits);
  const diffHour = prop("hours", subdividedUnits);
  const diffMin = prop("minutes", subdividedUnits);
  const diffSec = prop("seconds", subdividedUnits);
  const elapsedDisplay = sprintf("%02d:%02d:%02d", diffHour, diffMin, diffSec);
  return elapsedDisplay;
}

function ElapsedTime() {
  const { id } = useParams();

  const { state } = useStore();

  const basePath = ["byId", "items", id];
  const workLogPath = [...basePath, "workLog"];

  const workLog = pathOr([], workLogPath, state);

  const now = dayjs();

  const lastLogItemLens = lensIndex(-1);
  const tickTime = pipe(
    view(lastLogItemLens),
    has("endedAtMS"),
    not
  )(workLog);

  const startTime = workLog
    ? pipe(
        last,
        prop("startedAtMS"),
        dayjs
      )(workLog)
    : null;

  const timestamps = map(({ startedAtMS, endedAtMS }) => [startedAtMS, endedAtMS], workLog);
  const remaining = reduce(diffReducer, 0, timestamps);
  const [timeElapsed, setTimeElapsed] = useState(remaining);
  const [display, setDisplay] = useState();

  useInterval(
    () => {
      console.log("interval");
      setTimeElapsed(timeElapsed + 1000);
      setDisplay(formatDisplay(timeElapsed));
    },
    tickTime ? 1000 : null
  );
  return (
    <Style>
      <header>Elapsed Time</header>
      <div>{display}</div>
    </Style>
  );
}

export default ElapsedTime;

const Style = styled.section`
  display: flex;
  flex-direction: column;
  div {
    font-size: 2rem;
  }
`;
