import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";

const POSITION = { x: 0, y: 0 };

const Draggable = ({ children, id, onDrag, onDragEnd }) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
    width: undefined
  });

  const handleMouseDown = useCallback(({ clientX, clientY, ...rest }) => {
    const draggableWidth = rest.target.closest("li").clientWidth;
    setState(state => ({
      ...state,
      isDragging: true,
      width: draggableWidth,
      origin: { x: clientX, y: clientY }
    }));
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
      setState(oldState => ({ ...oldState, translation }));
      onDrag({ translation, id });
    },
    [state.origin, onDrag, id]
  );

  const handleMouseUp = useCallback(() => {
    setState(state => ({
      ...state,
      isDragging: false
    }));
    onDragEnd();
  }, [onDragEnd]);

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
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
      position: state.isDragging ? "absolute" : "relative",
      width: `${state.width}px`,
      backgroundColor: `#000`,
      boxShadow: state.isDragging ? "4px 4px 4px 1px rgb(40, 40, 40, 0.6)" : "none"
    }),
    [state.isDragging, state.translation]
  );

  return (
    <Style style={styles} onMouseDown={handleMouseDown}>
      {children}
    </Style>
  );
};

export default Draggable;

const Style = styled.div``;
