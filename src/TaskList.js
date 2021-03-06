import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import PointsTotal from "./PointsTotal";
import { useStore, handleNewItem, handleNewOrder, handleDeleteItem } from "./StoreContext";
import NewTaskForm from "./NewTaskForm";
const { append, converge, curry, filter, lt, map, path, pipe, prop, sum } = R;

const getPoints = curry((state, model, id) => path(["byId", model, id, "estimatedPoints"], state));

const TaskList = ({ label, items, basePath }) => {
  const itemsPath = append("items", basePath);
  const { state, dispatch } = useStore();
  const getPointsForState = getPoints(state);
  const getPointsByItem = converge(getPointsForState, [prop("model"), prop("id")]);
  const totalPoints = pipe(
    map(getPointsByItem),
    map(val => parseInt(val, 10)),
    filter(lt(0)),
    sum
  )(items);

  const handleNewOrderSubmit = useCallback(
    async reorderedIds => {
      const newState = await handleNewOrder(itemsPath, state, reorderedIds);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, itemsPath, state]
  );

  const handleDeleteItemClick = useCallback(
    async id => {
      const newState = await handleDeleteItem(itemsPath, state, id);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, itemsPath, state]
  );

  const handleNewTaskSubmit = useCallback(
    async item => {
      const newState = await handleNewItem(itemsPath, state, item);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, state, itemsPath]
  );

  return (
    <Style>
      <header>
        <h2>{label}</h2>
        <RightContent>
          <PointsTotal points={totalPoints} />
          <Progress counts={{ todoCount: 5, doneCount: 3, doingCount: 5 }} />
        </RightContent>
      </header>
      <StyledRankList
        items={items}
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
  display: flex;
  flex-direction: column;
  > header {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 128px;
    grid-gap: 4px;
  }

  > ul {
    padding: 0.1rem;
    max-height: 330px;
    overflow-y: scroll;
    overflow-x: none;
    scrollbar-color: white;
    outline: 1px solid rgba(70, 70, 70, 0.3);
  }
`;

const RightContent = styled.section`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: 64px 64px;
`;
