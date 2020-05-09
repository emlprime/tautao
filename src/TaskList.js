import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";
import {
  useStore,
  getData,
  putData,
  postData,
  handleNewItem,
  handleNewOrder,
  handleDeleteItem,
  persistProject,
} from "./StoreContext";
import NewTaskForm from "./NewTaskForm";
const { append, converge, curry, map, path, pipe, prop, sum } = R;

const getPoints = curry((state, model, id) => path(["byId", model, id, "points"], state));

const TaskList = ({ rootIds, basePath }) => {
  const rootIdsPath = append("rootIds", basePath);
  const { state, dispatch } = useStore();
  const getPointsForState = getPoints(state);
  const getPointsByItem = converge(getPointsForState, [prop("model"), prop("id")]);
  const totalPoints = pipe(
    map(getPointsByItem),
    sum
  )(rootIds);

  const name = "Milestones";

  const handleNewOrderSubmit = useCallback(
    async reorderedIds => {
      const newState = await handleNewOrder(rootIdsPath, state, reorderedIds);
      const project = path(basePath, newState);
      persistProject(project);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, basePath, rootIds]
  );

  const handleDeleteItemClick = useCallback(
    async id => {
      const newState = await handleDeleteItem(rootIdsPath, state, id);
      const project = path(basePath, newState);
      persistProject(project);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, rootIdsPath, state, basePath]
  );

  const handleNewTaskSubmit = useCallback(
    async item => {
      const newState = await handleNewItem(rootIdsPath, state, item);
      const project = path(basePath, newState);
      persistProject(project);
      dispatch({ type: "MERGE_STATE", payload: newState });
    },
    [dispatch, basePath, state]
  );

  return (
    <Style>
      <header>
        <h2>{name}</h2>
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
    height: 330px;
    overflow-y: scroll;
    scrollbar-color: white;
    outline: 1px solid rgba(70, 70, 70, 0.3);
  }
`;

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
`;
