import React, { useCallback } from "react";
import * as R from "ramda";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";
import { useStore } from "./StoreContext";

const getPoints = R.curry((state, model, id) => R.path(["byId", model, id, "points"], state));

const TaskList = ({ rootIds }) => {
  const { state } = useStore();
  const getPointsForState = getPoints(state);
  const getPointsByItem = R.converge(getPointsForState, [R.prop("model"), R.prop("id")]);
  const totalPoints = R.pipe(
    R.map(getPointsByItem),
    R.sum
  )(rootIds);
  console.log("points:", totalPoints);

  const name = "Milestones";
  const handleNewOrder = useCallback(order => {
    console.log("order:", order);
  }, []);
  return (
    <Style>
      <header>
        <h2>{name}</h2>
        <Totals>
          <Points points={totalPoints} />
          <Progress />
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
    height: 400px;
    overflow-y: scroll;
  }
`;

const Totals = styled.div`
  display: flex;
  width: 70px;
  justify-content: space-between;
`;
