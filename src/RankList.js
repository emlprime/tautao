import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";
import Button from "./Button";

const mapIndexed = R.addIndex(R.map);
const rankChanged = ([index, prevIndex]) => R.not(R.equals(index, prevIndex));

const inRange = (num, min, max) => num >= min && num < max;

const range = R.range(0);

const HEIGHT = 40;

const rejectIndexed = R.addIndex(R.reject);
const reflowedSubset = R.curry((superset, selection) =>
  R.map(R.pipe(R.prop(R.__, superset)))(selection)
);
const withSubsetRejected = R.curry((superset, selection) =>
  rejectIndexed((i, index) => R.includes(index, selection))(superset)
);

const spliceReflowedSelection = R.curry((insertionIndex, superset, selection) =>
  R.converge(R.insertAll(insertionIndex), [reflowedSubset(superset), withSubsetRejected(superset)])(
    selection
  )
);

const indexOfOrNil = R.curry((list, value) => {
  return R.pipe(R.ifElse(R.pipe(R.includes(R.__, list)), R.indexOf(R.__, list), R.always("")))(
    value
  );
});

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      const { index } = action.payload;

      const result = R.ifElse(R.includes(index), R.reject(R.equals(index)), R.append(index))(state);
      return result;
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

const RankList = ({ items, handleNewOrder, handleDeletePath }) => {
  const [selected, dispatch] = useReducer(reducer, []);

  const countOfItems = items.length;
  const indexOfSelectedOrNil = indexOfOrNil(selected);

  const handleReflowItems = useCallback(() => {
    handleNewOrder(spliceReflowedSelection(R.head(selected), items, selected));
    dispatch({ type: "CLEAR" });
  }, [items, selected]);

  const handleReflowItemsToTop = useCallback(() => {
    handleNewOrder(spliceReflowedSelection(0, items, selected));
    dispatch({ type: "CLEAR" });
  }, [selected]);

  const handleReflowItemsToBottom = useCallback(() => {
    handleNewOrder(spliceReflowedSelection(R.length(items), items, selected));
    dispatch({ type: "CLEAR" });
  }, [selected]);

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
              taskId={item}
              selectionIndex={indexOfSelectedOrNil(index)}
              handleClick={() => dispatch({ type: "UPDATE", payload: { index } })}
              handleDeletePath={handleDeletePath}
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
