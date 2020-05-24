import * as R from "ramda";

const { __, allPass, always, gt, has, ifElse, last, length, not, pathOr, pipe } = R;

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
