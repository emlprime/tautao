import * as R from "ramda";
import sprintf from "sprintf";

const {
  __,
  allPass,
  always,
  append,
  concat,
  gt,
  has,
  ifElse,
  isNil,
  join,
  last,
  length,
  not,
  pathOr,
  pipe,
  prepend,
  reduce,
} = R;

const reduceDuration = (durations, duration) => {
  if (isNil(duration)) {
    return durations;
  }

  return prepend(sprintf("%02d", duration), durations);
};

export const buildIncrementalDurationString = pipe(
  reduce(reduceDuration, []),
  join(":")
);
