import React from "react";
import * as R from "ramda";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "./StoreContext";
import { traceAncestry } from "./utils/recursion";

function Spacer() {
  return <span>&nbsp;&gt;&nbsp;</span>;
}

const buildTaskPath = R.pipe(
  R.prop("id"),
  R.append(R.__, ["byId", "items"])
);

const formatCrumb = R.pick(["id", "name"]);

const findAncestor = ({ id, task, state: { byId, currentProjectId } }) => {
  const items = R.path([id, "items"], byId);
  const crumb = formatCrumb(task);
  return [];

  const containsId = taskId => R.any(R.propEq("id", taskId));
  const containsMyId = containsId(id);

  if (containsMyId(items)) {
    return [crumb];
  } else {
    const parent = R.find(R.pathSatisfies(R.includes(id)))(R.values(byId));
    return R.append(
      crumb,
      findAncestor({ taskId: parent.id, task: parent, state: { byId, items } })
    );
  }
};

function shittyUrlBuilder(model, id) {
  return R.ifElse(R.equals("projects"), R.always("/"), R.always(`/items/${id}`))(model);
}

function Breadcrumb({ projectName }) {
  const { id } = useParams();
  const {
    state: { byId },
  } = useStore();

  if (!id) {
    return null;
  }
  const crumbs = traceAncestry(byId, { model: "items", id });

  return (
    <Ul>
      {R.map(
        ({ id, name, model }) => (
          <li key={id}>
            <Spacer />
            <Link to={shittyUrlBuilder(model, id)}>{name}</Link>
          </li>
        ),
        crumbs
      )}
    </Ul>
  );
}

export default Breadcrumb;

const Ul = styled.ul`
  display: flex;
  li {
    padding: 0 0.1rem;
    white-space: nowrap;
  }
`;
