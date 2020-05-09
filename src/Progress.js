import React from "react";
import * as R from "ramda";
import styled from "styled-components";

const {
  append,
  assoc,
  converge,
  dissoc,
  divide,
  filter,
  identity,
  is,
  join,
  keys,
  mapObjIndexed,
  merge,
  multiply,
  objOf,
  pipe,
  prop,
  reduce,
  replace,
  sum,
  tap,
  values,
} = R;

const countToHeight = replace(/Count/, "Height");

const replaceKey = transform => (acc, cur) =>
  pipe(
    assoc(transform(cur), prop(cur, acc)),
    dissoc(cur)
  )(acc);

const replaceCountToHeight = replaceKey(countToHeight);

function Progress({ counts }) {
  const height = 35;

  const totalValues = pipe(
    values,
    filter(is(Number)),
    sum,
    objOf("total")
  );

  const applySpecHeight = (value, key, obj) =>
    converge(
      pipe(
        divide,
        multiply(height),
        progressHeight => parseInt(progressHeight, 10)
      ),
      [prop(key), prop("total")]
    )(obj);

  const percentages = pipe(
    converge(merge, [totalValues, identity]),
    mapObjIndexed(applySpecHeight),
    dissoc("total")
  )(counts);

  const theHeights = reduce(replaceCountToHeight, percentages)(keys(percentages));

  const formatTooltip = (acc, key) => {
    const string = `${key}: ${prop(key, counts)}`;
    return append(string, acc);
  };

  const title = pipe(
    reduce(formatTooltip, []),
    join("\n")
  )(keys(counts));

  return (
    <Style {...theHeights} title={title}>
      <div className="todo" />
      <div className="doing" />
      <div className="done" />
    </Style>
  );
}

export default Progress;

const Style = styled.section`
  display: flex;
  width: 32px;
  flex-direction: column;
  .done {
    background-color: green;
    height: ${({ doneHeight }) => doneHeight}px;
  }
  .doing {
    background-color: blue;
    height: ${({ doingHeight }) => doingHeight}px;
  }
  .todo {
    background-color: rgb(150, 50, 50);
    height: ${({ todoHeight }) => todoHeight}px;
  }
  font-size: 0.5rem;
  text-align: right;
  span {
    margin-right: 0.4rem;
  }
`;
