import React, { useCallback } from "react";
import RankList from "./RankList";
import styled from "styled-components";
import Progress from "./Progress";
import Points from "./Points";

const TaskList = ({ rootIds }) => {
  const name = "Milestones";
  const handleNewOrder = useCallback(order => {
    console.log("order:", order);
  }, []);
  return (
    <Style>
      <header>
        <h2>{name}</h2>
        <Totals>
          <Points points={23} />
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
