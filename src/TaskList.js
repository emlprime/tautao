import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";
import { useStore, handleNewItem, handleNewOrder, handleDeleteItem } from "./StoreContext";
import NewTaskForm from "./NewTaskForm";
const { append, converge, curry, filter, is, lt, map, path, pipe, prop, sum, tap } = R;

const getPoints = curry((state, model, id) => path(["byId", model, id, "estimatedPoints"], state));

const TaskList = ({ label, rootIds, basePath }) => {
  const rootIdsPath = append("rootIds", basePath);
  const { state, dispatch } = useStore();
  const getPointsForState = getPoints(state);
  const getPointsByItem = converge(getPointsForState, [prop("model"), prop("id")]);
  const totalPoints = pipe(
    map(getPointsByItem),
    map(val => parseInt(val, 10)),
    filter(lt(0)),
    sum
  )(rootIds);

  const handleNewOrderSubmit = useCallback(
    async reorderedIds => {
      const newState = await handleNewOrder(rootIdsPath, state, reorderedIds);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, basePath, rootIds]
  );

  const handleDeleteItemClick = useCallback(
    async id => {
      const newState = await handleDeleteItem(rootIdsPath, state, id);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, rootIdsPath, state, basePath]
  );

  const handleNewTaskSubmit = useCallback(
    async item => {
      const newState = await handleNewItem(rootIdsPath, state, item);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, basePath, state]
  );

  return (
    <Style>
      <header>
        <h2>{label}</h2>
        <Totals>
          <Points points={totalPoints} />
          <Progress counts={{ todoCount: 5, doneCount: 3, doingCount: 5 }} />
        </Totals>
      </header>
      <StyledRankList
        items={rootIds}
        handleNewOrderSubmit={handleNewOrderSubmit}
        handleDeleteItemClick={handleDeleteItemClick}
      />
      <NewTaskForm handleNewTaskSubmit={handleNewTaskSubmit} />
    </Style>
  );
};

export default TaskList;

const StyledRankList = styled(RankList)``;

const Style = styled.section`
  header {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
  }
  ul {
    padding: 0.1rem;
    max-height: 330px;
    overflow-y: scroll;
    overflow-x: none;
    scrollbar-color: white;
    outline: 1px solid rgba(70, 70, 70, 0.3);
  }
`;

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
`;
