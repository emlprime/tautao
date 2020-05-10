import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";
import Button from "./Button";

const {
  __,
  addIndex,
  always,
  append,
  curry,
  equals,
  head,
  ifElse,
  includes,
  indexOf,
  length,
  map,
  pipe,
  prop,
  reject,
} = R;

const mapIndexed = addIndex(map);

const rejectIndexed = addIndex(reject);
const reflowedSubset = curry((superset, selection) => map(pipe(prop(__, superset)))(selection));
const withSubsetRejected = curry((superset, selection) =>
  rejectIndexed((i, index) => includes(index, selection))(superset)
);

const spliceReflowedSelection = R.curry((insertionIndex, superset, selection) =>
  R.converge(R.insertAll(insertionIndex), [reflowedSubset(superset), withSubsetRejected(superset)])(
    selection
  )
);

const indexOfOrNil = curry((list, value) => {
  return pipe(ifElse(pipe(includes(__, list)), indexOf(__, list), always("")))(value);
});

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      const { index } = action.payload;

      const result = ifElse(includes(index), reject(equals(index)), append(index))(state);
      return result;
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

const RankList = ({ items, handleNewOrderSubmit, handleDeleteItemClick }) => {
  const [selected, dispatch] = useReducer(reducer, []);

  const indexOfSelectedOrNil = indexOfOrNil(selected);

  const handleReflowItems = useCallback(() => {
    handleNewOrderSubmit(spliceReflowedSelection(head(selected), items, selected));
    dispatch({ type: "CLEAR" });
  }, [items, selected, handleNewOrderSubmit]);

  const handleReflowItemsToTop = useCallback(() => {
    handleNewOrderSubmit(spliceReflowedSelection(0, items, selected));
    dispatch({ type: "CLEAR" });
  }, [selected, handleNewOrderSubmit, items]);

  const handleReflowItemsToBottom = useCallback(() => {
    handleNewOrderSubmit(spliceReflowedSelection(length(items), items, selected));
    dispatch({ type: "CLEAR" });
  }, [selected, items, handleNewOrderSubmit]);

  const showButtons = selected.length > 0;
  return (
    <Style>
      <header>
        {showButtons && <Button handleClick={() => handleReflowItems()}>Reorder</Button>}
        {showButtons && <Button handleClick={() => handleReflowItemsToTop()}>Top</Button>}
        {showButtons && <Button handleClick={() => handleReflowItemsToBottom()}>Bottom</Button>}
      </header>
      <ul>
        {mapIndexed((item, index) => {
          return (
            <TaskListItem
              key={item.id}
              taskId={item}
              selectionIndex={indexOfSelectedOrNil(index)}
              handleClick={() => dispatch({ type: "UPDATE", payload: { index } })}
              handleDeleteItemClick={handleDeleteItemClick}
            />
          );
        })(items)}
      </ul>
    </Style>
  );
};

export default RankList;

const Style = styled.section`
  header {
    height: 20px;
  }
`;
