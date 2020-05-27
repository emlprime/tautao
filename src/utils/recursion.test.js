const { pick } = require("ramda");
const { traceAncestor } = require("./recursion");

const getBcData = pick(["id", "model", "name"]);

describe("traceAncestry", () => {
  const project = {
    id: "abc123",
    model: "projects",
    name: "Tau Tao",
    items: [{ model: "items", id: "abc123" }],
  };
  const item1 = {
    id: "abc123",
    model: "items",
    name: "item1",
    items: [{ model: "items", id: "def123" }],
  };
  const item2 = { id: "def123", model: "items", name: "item2" };
  const byId = {
    projects: {
      abc123: project,
    },
    items: {
      abc123: item1,
      def123: item2,
    },
  };

  test("At the project level", () => {
    expect(traceAncestry(byId, { model: "projects", id: "abc123" })).toEqual([getBcData(project)]);
  });

  test("At the first item level", () => {
    expect(traceAncestry(byId, { model: "items", id: "abc123" })).toEqual([
      getBcData(project),
      getBcData(item1),
    ]);
  });

  test("At the second item level", () => {
    expect(traceAncestry(byId, { model: "items", id: "def123" })).toEqual([
      getBcData(project),
      getBcData(item1),
      getBcData(item2),
    ]);
  });
});
