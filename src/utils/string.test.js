const { buildIncrementalDurationString } = require("./string");

describe("buildIncrementalDurationString", () => {
  test("with no time increments defined", () => {
    expect(buildIncrementalDurationString([undefined, undefined, undefined])).toEqual("");
  });

  test("with only seconds defined", () => {
    expect(buildIncrementalDurationString([1, undefined, undefined])).toEqual("01");
  });

  test("with only double digit seconds defined", () => {
    expect(buildIncrementalDurationString([59, undefined, undefined])).toEqual("59");
  });

  test("with 0 seconds and minutes defined", () => {
    expect(buildIncrementalDurationString([0, 1, undefined])).toEqual("01:00");
  });

  test("with single digit seconds and minutes defined", () => {
    expect(buildIncrementalDurationString([1, 1, undefined])).toEqual("01:01");
  });

  test("with single digit seconds and minutes defined", () => {
    expect(buildIncrementalDurationString([2, 1, undefined])).toEqual("01:02");
  });

  test("with single digit seconds and minutes defined and hours", () => {
    expect(buildIncrementalDurationString([2, 1, 3])).toEqual("03:01:02");
  });
});
