import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";

const POSITION = { x: 0, y: 0 };

const Draggable = ({ children, id, onDrag, onDragEnd }) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION
  });

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    console.log("mouseDown");
    setState(state => ({
      ...state,
      isDragging: true,
      origin: { x: clientX, y: clientY }
    }));
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      console.log("moving", state);
      const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
      setState(state => ({ ...state, translation }));
      onDrag({ translation, id });
    },
    [state.origin, onDrag, id]
  );

  const handleMouseUp = useCallback(
    ({}) => {
      setState(state => ({
        ...state,
        isDragging: false
      }));
      onDragEnd();
    },
    [onDragEnd]
  );

  useEffect(() => {
    if (state.isDragging) {
      console.log("add event listener");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      console.log("remove event listener");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? "-webkit-grabbing" : "-webkit-grab",
      transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
      transition: state.isDragging ? "none" : "transform 500ms",
      zIndex: state.isDragging ? 2 : 1,
      position: state.isDragging ? "absolute" : "relative"
    }),
    [state.isDragging, state.translation]
  );
  console.log("styles:", styles);

  return (
    <Style style={styles} onMouseDown={handleMouseDown}>
      {children}
    </Style>
  );
};

export default Draggable;

const Style = styled.div`
  outline: 2px dashed green;
`;
