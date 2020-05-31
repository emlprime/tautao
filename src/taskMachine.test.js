import * as R from "ramda";
import { interpret } from "xstate";
import initTaskMachine from "./taskMachine";

const { map } = R;

const runScenario = (mockCallback, scenario, initialState) => {
  const service = interpret(initTaskMachine(initialState))
    .onTransition(state => mockCallback(state.value))
    .start();
  map(service.send, scenario);
};

let mockCallback;

describe("useTaskState", () => {
  beforeEach(() => {
    mockCallback = jest.fn();
  });

  test("easy", () => {
    runScenario(mockCallback, ["START", "FINISH"]);
    console.log(mockCallback.mock.calls);
    expect(mockCallback.mock.calls).toEqual([
      ["todo"],
      [{ inProgress: "doing" }],
      [{ success: "finishing" }],
    ]);
  });

  test("alreadyInProgress", () => {
    runScenario(mockCallback, ["FINISH"], "inProgress");
    expect(mockCallback.mock.calls).toEqual([
      [{ inProgress: "doing" }],
      [{ success: "finishing" }],
    ]);
  });

  test("nonStarter", () => {
    runScenario(mockCallback, ["CLOSE"]);
    expect(mockCallback.mock.calls).toEqual([["todo"], [{ failure: "cancelling" }]]);
  });

  test("terminallyBlocked", () => {
    runScenario(mockCallback, ["START", "BLOCK", "QUIT"]);
    expect(mockCallback.mock.calls).toEqual([
      ["todo"],
      [{ inProgress: "doing" }],
      [{ inProgress: "blocked" }],
      [{ failure: "cancelling" }],
    ]);
  });

  test("temporarilyBlocked", () => {
    runScenario(mockCallback, ["START", "BLOCK", "UNBLOCK", "FINISH"]);
    expect(mockCallback.mock.calls).toEqual([
      ["todo"],
      [{ inProgress: "doing" }],
      [{ inProgress: "blocked" }],
      [{ inProgress: "doing" }],
      [{ success: "finishing" }],
    ]);
  });

  test("takeLunch", () => {
    runScenario(mockCallback, ["START", "PAUSE", "RESUME", "FINISH"]);
    expect(mockCallback.mock.calls).toEqual([
      ["todo"],
      [{ inProgress: "doing" }],
      [{ inProgress: "paused" }],
      [{ inProgress: "doing" }],
      [{ success: "finishing" }],
    ]);
  });

  test("willTheyWontThey", () => {
    runScenario(mockCallback, [
      "START",
      "BLOCK",
      "UNBLOCK",
      "BLOCK",
      "UNBLOCK",
      "BLOCK",
      "UNBLOCK",
      "FINISH",
    ]);

    expect(mockCallback.mock.calls).toEqual([
      ["todo"],
      [{ inProgress: "doing" }],
      [{ inProgress: "blocked" }],
      [{ inProgress: "doing" }],
      [{ inProgress: "blocked" }],
      [{ inProgress: "doing" }],
      [{ inProgress: "blocked" }],
      [{ inProgress: "doing" }],
      [{ success: "finishing" }],
    ]);
  });
});
