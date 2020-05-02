import React from "react";
import * as R from "ramda";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "./StoreContext";

function Spacer() {
  return <span>&nbsp;&gt;&nbsp;</span>;
}

const buildTaskPath = R.pipe(
  R.prop("taskId"),
  R.append(R.__, ["byId"])
);

const formatCrumb = R.pick(["id", "name"]);

const findAncestor = ({ taskId, task, context: { byId, rootIds } }) => {
  const crumb = formatCrumb(task);
  if (R.includes(taskId, rootIds)) {
    return [crumb];
  } else {
    const parent = R.find(R.pathSatisfies(R.includes(taskId)))(R.values(byId));
    return R.append(
      crumb,
      findAncestor({ taskId: parent.id, task: parent, context: { byId, rootIds } })
    );
  }
};

const traceAncestry = props =>
  R.pipe(
    R.converge(R.assoc("task"), [
      R.converge(R.path, [buildTaskPath, R.prop("context")]),
      R.identity
    ]),
    findAncestor
  )(props);

function Breadcrumb({ projectName }) {
  const { taskId } = useParams();

  const { state } = useStore();

  const crumbs = taskId ? traceAncestry({ state, taskId }) : [];

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
