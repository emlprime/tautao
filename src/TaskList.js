import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";
import { useStore } from "./StoreContext";
import NewTaskForm from "./NewTaskForm";

const getPoints = R.curry((state, model, id) => R.path(["byId", model, id, "points"], state));

const TaskList = ({ rootIds, path }) => {
  const { state, dispatch } = useStore();
  const getPointsForState = getPoints(state);
  const getPointsByItem = R.converge(getPointsForState, [R.prop("model"), R.prop("id")]);
  const totalPoints = R.pipe(
    R.map(getPointsByItem),
    R.sum
  )(rootIds);

  const name = "Milestones";

  const handleNewOrder = useCallback(
    newIds => {
      dispatch({ type: "MERGE_VALUE", payload: { path, value: newIds } });
    },
    [dispatch, path, rootIds]
  );

  const handleDeletePath = useCallback(
    id => {
      console.log("id:", id, path);

      dispatch({ type: "DELETE_LIST_ITEM", payload: { path: path, id } });
      dispatch({ type: "DELETE_BY_ID", payload: id });
    },
    [dispatch, path]
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
        handleNewOrder={handleNewOrder}
        handleDeletePath={handleDeletePath}
      />
      <NewTaskForm />
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
