const { calcShowStartAndShowEnd, calcShowDecompose } = require("./control");

describe("calcShowStartAndShowEnd", () => {
  test("with empty list", () => {
    const [start, end] = calcShowStartAndShowEnd([]);
    expect(start).toEqual(true);
    expect(end).toEqual(false);
  });

  test("with one item incomplete", () => {
    const [start, end] = calcShowStartAndShowEnd([{ startedAtMS: 123456 }]);
    expect(start).toEqual(false);
    expect(end).toEqual(true);
  });

  test("with one item complete", () => {
    const [start, end] = calcShowStartAndShowEnd([{ startedAtMS: 123456, endedAtMS: 123466 }]);
    expect(start).toEqual(true);
    expect(end).toEqual(false);
  });

  test("with N items incomplete", () => {
    const [start, end] = calcShowStartAndShowEnd([
      { startedAtMS: 123456, endedAtMS: 123466 },
      { startedAtMS: 123456 },
    ]);
    expect(start).toEqual(false);
    expect(end).toEqual(true);
  });

  test("with N items complete", () => {
    const [start, end] = calcShowStartAndShowEnd([
      { startedAtMS: 123456, endedAtMS: 123466 },
      { startedAtMS: 123456, endedAtMS: 234343 },
    ]);
    expect(start).toEqual(true);
    expect(end).toEqual(false);
  });
});

describe("calcShowDecompose", () => {
  const state = {
    byId: {
      items: {
        HASTASKS: { items: [] },
        HASNOTASKS: {},
      },
    },
  };

  test("with no children", () => {
    expect(calcShowDecompose(state, "HASTASKS")).toEqual(false);
  });

  test("with children", () => {
    expect(calcShowDecompose(state, "HASNOTASKS")).toEqual(true);
  });
});
