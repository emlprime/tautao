import React, { useCallback } from "react";
import RankList from "./RankList";
import styled from "styled-components";

const TaskList = ({ rootIds }) => {
  const name = "Milestones";
  const handleNewOrder = useCallback(order => {
    console.log("order:", order);
  }, []);
  return (
    <Style>
      <h2>{name}</h2>
      <StyledRankList items={rootIds} handleNewOrder={handleNewOrder} />
    </Style>
  );
};

export default TaskList;

const StyledRankList = styled(RankList)``;

const Style = styled.section`
  h2 {
    margin-top: 1rem;
  }
  ul {
    height: 400px;
    overflow-y: scroll;
  }
`;
