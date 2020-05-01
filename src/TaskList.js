import React, { useCallback } from "react";
import RankList from "./RankList";

const TaskList = ({ rootIds }) => {
  const handleNewOrder = useCallback(order => {
    console.log("order:", order);
  }, []);
  return <RankList items={rootIds} handleNewOrder={handleNewOrder} />;
};

export default TaskList;
