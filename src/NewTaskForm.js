import React, { useCallback, useEffect, useReducer, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import FieldText from "./FieldText";
import FieldNumber from "./FieldNumber";
import Button from "./Button";

function reducer(state, action) {
  switch (action.type) {
    case "SET_VALUE":
      return R.merge(state, action.payload);
    case "CLEAR":
      console.log("clearing");
      return { name: "", points: "" };
    default:
      return state;
  }
}

function NewTaskForm({ handleNewTaskSubmit }) {
  const [data, dispatch] = useReducer(reducer, { name: undefined, points: undefined });

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(R.anyPass([R.isNil, R.isEmpty])(data.name));
  }, [data.name, isDisabled, setIsDisabled]);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      handleNewTaskSubmit(data);
      dispatch({ type: "CLEAR" });
    },
    [data]
  );

  return (
    <Style onSubmit={handleSubmit}>
      <FieldText
        id="new_name"
        name="name"
        placeholder="Describe your task here..."
        value={data.name}
        onChange={e => dispatch({ type: "SET_VALUE", payload: { name: e.target.value } })}
      />
      <FieldNumber
        id="new_points"
        name="points"
        placeholder="Pts"
        value={data.points}
        onChange={e => dispatch({ type: "SET_VALUE", payload: { points: e.target.value } })}
      />
      <Button type="submit" disabled={isDisabled}>
        Add
      </Button>
    </Style>
  );
}

export default NewTaskForm;

const Style = styled.form`
  padding-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 50px 50px;
`;
