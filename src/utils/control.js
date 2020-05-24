import * as R from "ramda";

const { __, always, gt, has, ifElse, last, length, pathOr, pipe } = R;

const hasItems = pipe(
  length,
  gt(__, 0)
);

const latestItemContains = key =>
  pipe(
    last,
    has(key)
  );

const primaryMode = always([true, false]);
const secondaryMode = always([false, true]);

export const calcShowStartAndShowEnd = pipe(
  ifElse(hasItems, ifElse(latestItemContains("endedAtMS"), primaryMode, secondaryMode), primaryMode)
);
