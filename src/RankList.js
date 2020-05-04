import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import * as R from "ramda";
import TaskListItem from "./TaskListItem";

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

const spliceReflowedSelection = R.curry((superset, selection) =>
  R.converge(R.insertAll(R.head(selection)), [
    reflowedSubset(superset),
    withSubsetRejected(superset)
  ])(selection)
);

const indexOfOrNil = R.curry((list, value) => {
  return R.pipe(R.ifElse(R.pipe(R.includes(R.__, list)), R.indexOf(R.__, list), R.always("")))(
    value
  );
});

const reducer = (state, action) => {
  const { index } = action;
  const result = R.ifElse(R.includes(index), R.reject(index), R.append(index))(state);
  return result;
};

const RankList = ({ items, handleNewOrder }) => {
  const [selected, dispatch] = useReducer(reducer, []);

  const countOfItems = items.length;
  const indexOfSelectedOrNil = indexOfOrNil(selected);
  const handleReflowItems = useCallback(() => {
    handleNewOrder(spliceReflowedSelection(items, selected));
  }, [items, selected]);

  return (
    <Style>
      <button type="button" onClick={() => handleReflowItems()}>
        Reorder
      </button>
      <ul>
        {mapIndexed((item, index) => {
          return (
            <TaskListItem
              taskId={item}
              selectionIndex={indexOfSelectedOrNil(index)}
              handleClick={() => dispatch({ index })}
            />
          );
        })(items)}
      </ul>
    </Style>
  );
};

export default RankList;

const Style = styled.section`
  button {
    background-color: #000;
    border-color: #333;
    color: #444;
  }
`;
