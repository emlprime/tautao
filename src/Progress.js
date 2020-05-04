import React from "react";
import * as R from "ramda";
import styled from "styled-components";

const countToHeight = R.replace(/Count/, "Height");

const replaceKey = transform => (acc, cur) =>
  R.pipe(
    R.assoc(transform(cur), R.prop(cur, acc)),
    R.dissoc(cur)
  )(acc);

const replaceCountToHeight = replaceKey(countToHeight);

function Progress({ counts }) {
  const height = 35;

  const totalValues = R.pipe(
    R.values,
    R.sum,
    R.objOf("total")
  );

  const applySpecHeight = (value, key, obj) =>
    R.converge(
      R.pipe(
        R.divide,
        R.multiply(height),
        progressHeight => parseInt(progressHeight, 10)
      ),
      [R.prop(key), R.prop("total")]
    )(obj);

  const percentages = R.pipe(
    R.converge(R.merge, [totalValues, R.identity]),
    R.mapObjIndexed(applySpecHeight),
    R.dissoc("total")
  )(counts);

  const theHeights = R.reduce(replaceCountToHeight, percentages)(R.keys(percentages));

  const formatTooltip = (acc, key) => {
    const string = `${key}: ${R.prop(key, counts)}`;
    return R.append(string, acc);
  };

  const title = R.pipe(
    R.reduce(formatTooltip, []),
    R.join("\n")
  )(R.keys(counts));

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
