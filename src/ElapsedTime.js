import React, { useState } from "react";
import sprintf from "sprintf";
import styled from "styled-components";
import * as R from "ramda";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import useInterval from "./useInterval";
const { has, last, lensIndex, modulo, not, pipe, prop, propOr, view } = R;

function ElapsedTime() {
  const { id } = useParams();
  const [timeElapsed, setTimeElapsed] = useState();

  const { state } = useStore();

  const basePath = ["byId", "items", id];
  const workLogPath = [...basePath, "workLog"];

  const workLog = R.pathOr([], workLogPath, state);
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

  useInterval(
    () => {
      const diffHour = now.diff(startTime, "hour");
      const diffMin = modulo(now.diff(startTime, "minute"), 60);
      const diffSec = modulo(now.diff(startTime, "second"), 60);
      const elapsedDisplay = sprintf("%02d:%02d:%02d", diffHour, diffMin, diffSec);

      setTimeElapsed(elapsedDisplay);
    },
    tickTime ? 1000 : null
  );
  return (
    <Style>
      <header>Elapsed Time</header>

      <div>{timeElapsed}</div>
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
