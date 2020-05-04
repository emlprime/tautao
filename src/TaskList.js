import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";
import { useStore } from "./StoreContext";

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
    order => {
      const newRootIds = R.map(R.pipe(R.prop(R.__, rootIds)))(order);
      dispatch({ type: "MERGE_VALUE", payload: { path, value: newRootIds } });
    },
    [dispatch, path, rootIds]
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
      <StyledRankList items={rootIds} handleNewOrder={handleNewOrder} />
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
    height: 330px;
    overflow-y: scroll;
    outline: 1px solid rgba(70, 70, 70, 0.3);
  }
`;

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
`;
