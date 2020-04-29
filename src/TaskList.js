import React, { useCallback, useState } from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";
import Draggable from "./Draggable";

const inRange = (num, min, max) => num >= min && num < max;

const range = R.range(0);

const HEIGHT = 40;

const TaskList = ({ rootIds: rootIds }) => {
  const items = range(rootIds.length);
  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null
  });

  const handleDrag = useCallback(
    ({ translation, id }) => {
      const delta = Math.round(translation.y / HEIGHT);
      const index = state.order.indexOf(id);
      const dragOrder = state.order.filter(index => index !== id);

      if (!inRange(index + delta, 0, items.length)) {
        return;
      }

      dragOrder.splice(index + delta, 0, id);

      setState(state => ({
        ...state,
        draggedIndex: id,
        dragOrder
      }));
    },
    [state.order, items.length]
  );

  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);

  return (
    <Container>
      {items.map(index => {
        const isDragging = state.draggedIndex === index;
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
        const shadow = isDragging ? "0 5px 10px rgba(60, 60, 60, 0.35)" : "none";
        return (
          <Draggable key={index} id={index} onDrag={handleDrag} onDragEnd={handleDragEnd}>
            <Rect isDragging={isDragging} top={isDragging ? draggedTop : top} shadow={shadow}>
              <TaskListItem taskId={rootIds[index]} />
            </Rect>
          </Draggable>
        );
      })}
    </Container>
  );
};

export default TaskList;

const Container = styled.ul`
  position: relative;
`;
// const Container = styled.div`
//    width: 100vw;
//    min-height: 100vh;
// `;

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
