import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";
import Draggable from "./Draggable";

const mapIndexed = R.addIndex(R.map);
const rankChanged = ([index, prevIndex]) => R.not(R.equals(index, prevIndex));

const inRange = (num, min, max) => num >= min && num < max;

const range = R.range(0);

const HEIGHT = 40;

const RankList = ({ items, handleNewOrder, dispatch }) => {
  const countOfItems = items.length;
  const itemIndices = range(countOfItems);
  const [state, setState] = useState({
    order: itemIndices,
    dragOrder: itemIndices, // items order while dragging
    draggedIndex: null
  });

  const handleDrag = useCallback(
    ({ translation, id }) => {
      const delta = Math.round(translation.y / HEIGHT);
      const index = state.order.indexOf(id);
      const dragOrder = state.order.filter(index => index !== id);

      if (!inRange(index + delta, 0, countOfItems)) {
        return;
      }

      dragOrder.splice(index + delta, 0, id);

      setState(state => ({
        ...state,
        draggedIndex: id,
        dragOrder
      }));
    },
    [state.order, countOfItems]
  );

  const handleDragEnd = useCallback(id => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);

  useEffect(() => {
    R.pipe(
      mapIndexed((itemsIndex, i) => [i, itemsIndex, items[itemsIndex]]),
      R.any(rankChanged),

      R.ifElse(R.equals(true), () => handleNewOrder(state.order), R.always())
    )(state.order);
  }, [state.order, handleNewOrder]);

  return (
    <Container>
      {itemIndices.map(index => {
        const isDragging = state.draggedIndex === index;
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
        const shadow = isDragging ? "2px 5px 8px rgba(60, 60, 60, 0.85)" : "none";
        return (
          <Draggable key={index} id={index} onDrag={handleDrag} onDragEnd={handleDragEnd}>
            <Rect isDragging={isDragging} top={isDragging ? draggedTop : top} shadow={shadow}>
              <TaskListItem taskId={items[index]} />
            </Rect>
          </Draggable>
        );
      })}
    </Container>
  );
};

export default RankList;

const Container = styled.ul`
  position: relative;
`;

const Rect = styled.div.attrs(props => ({
  style: {
    transition: props.isDragging ? "none" : "all 500ms"
  }
}))`
  width: 100%;
  user-select: none;
  height: ${HEIGHT}px;
  box-shadow: ${({ shadow }) => shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${({ top }) => 10 + top}px;
  background-color: #000;
`;
