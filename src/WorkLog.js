import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import WorkLogItem from "./WorkLogItem";

const { pathOr, addIndex, map } = R;
const mapIndexed = addIndex(map);

function WorkLog() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const basePath = ["byId", "items", id];

  const { workLog } = pathOr({}, basePath, state);
  console.log("workLog:", workLog);

  return (
    <Style>
      <header>WorkLog:</header>
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {mapIndexed(
            ({ startedAtMS, endedAtMS }, index) => (
              <tr key={index}>
                <td className="time">
                  <WorkLogItem>{startedAtMS}</WorkLogItem>
                </td>
                <td className="time">
                  <WorkLogItem>{endedAtMS}</WorkLogItem>
                </td>
              </tr>
            ),
            workLog
          )}
        </tbody>
      </table>
    </Style>
  );
}

export default WorkLog;

const Style = styled.section`
  display: flex;
  width: 200px;
  flex-direction: column;
  .time {
    text-align: center;
  }
`;
