import * as R from "ramda";

const {
  __,
  allPass,
  always,
  append,
  curry,
  find,
  gt,
  has,
  ifElse,
  includes,
  isNil,
  last,
  length,
  lensPath,
  not,
  pathOr,
  path,
  pathSatisfies,
  pick,
  pipe,
  prepend,
  prop,
  tap,
  values,
  view,
} = R;

const getBcData = pick(["id", "model", "name"]);

const isParent = curry((byId, itemId, { model: candidateModel, id: candidateId }) =>
  pipe(
    path([candidateModel, candidateId, "items"]),
    allPass([
      pipe(
        isNil,
        not
      ),
      includes(itemId),
    ])
  )(byId)
);

export const traceAncestor = (byId, { model, id }, ancestry = []) => {
  if (model === "projects") {
    const project = getBcData(path([model, id], byId));
    return prepend(project, ancestry);
  } else {
    const item = getBcData(path([model, id], byId));

    const isMyParent = isParent(byId, { model, id });
    const projectParent = find(isMyParent, values(prop("projects", byId)));
    if (projectParent) {
      return traceAncestor(byId, pick(["id", "model"], projectParent), prepend(item, ancestry));
    }
    const itemParent = find(isMyParent, values(prop("items", byId)));
    return traceAncestor(byId, pick(["id", "model"], itemParent), prepend(item, ancestry));
  }
};
