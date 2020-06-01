import * as R from "ramda";

const {
  __,
  allPass,
  always,
  append,
  equals,
  gt,
  has,
  ifElse,
  is,
  last,
  length,
  lensPath,
  not,
  pathOr,
  pipe,
  tap,
  view,
} = R;

// predicate non-empty list
const hasItems = pipe(
  length,
  gt(__, 0)
);

// predicate looking for non-presence of key in last item in a list
const lastItemDoesNotContain = key =>
  pipe(
    last,
    has(key),
    not
  );

// toggle modes for mutually exclusive components
const primaryMode = always([true, false]);
const secondaryMode = always([false, true]);

// specifically looking for a key in the last item in a list of timestamp pairs
export const calcShowStartAndShowEnd = ifElse(
  allPass([hasItems, lastItemDoesNotContain("endedAtMS")]),
  secondaryMode,
  primaryMode
);

const hasNoItems = (state, id) =>
  pipe(
    append(__, ["byId", "items"]),
    lensPath,
    view(__, state),
    has("items"),
    not
  )(id);

const isNotStarted = equals("todo");

export const calcShowDecompose = (state, id, status) => {
  return hasNoItems && isNotStarted(status);
};
