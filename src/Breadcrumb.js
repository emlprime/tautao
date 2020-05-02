import React from "react";
import * as R from "ramda";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "./StoreContext";

function Spacer() {
  return <span>&nbsp;&gt;&nbsp;</span>;
}

const buildTaskPath = R.pipe(
  R.prop("id"),
  R.append(R.__, ["byId", "items"])
);

const formatCrumb = R.pick(["id", "name"]);

const findAncestor = ({ id, task, state: { byId, currentProjectId } }) => {
  console.log("task:", task);
  const rootIds = R.path(["projects", currentProjectId, "rootIds"], byId);
  const crumb = formatCrumb(task);

  const containsId = taskId => R.any(R.propEq("id", taskId));
  const containsMyId = containsId(id);

  if (containsMyId(rootIds)) {
    return [crumb];
  } else {
    const parent = R.find(R.pathSatisfies(R.includes(id)))(R.values(byId));
    return R.append(
      crumb,
      findAncestor({ taskId: parent.id, task: parent, state: { byId, rootIds } })
    );
  }
};

const traceAncestry = props =>
  R.pipe(
    R.converge(R.assoc("task"), [R.converge(R.path, [buildTaskPath, R.prop("state")]), R.identity]),
    findAncestor
  )(props);

function Breadcrumb({ projectName }) {
  const { id } = useParams();
  const { state } = useStore();

  const crumbs = id ? traceAncestry({ state, id }) : [];

  return (
    <Ul>
      <li>
        <Link to="/">{projectName}</Link>
      </li>
      {R.map(
        ({ id, name }) => (
          <li key={id}>
            <Spacer />
            <Link to={`/task/${id}`}>{name}</Link>
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
  }
`;
