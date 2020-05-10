import React from "react";
import FieldNumber from "./FieldNumber";

function Points(params) {
  return (
    <FieldNumber
      placeholder="Pts"
      {...{ id: "estimatedPoints", name: "estimatedPoints", ...params }}
    />
  );
}

export default Points;
