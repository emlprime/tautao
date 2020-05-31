import * as R from "ramda";
import { createMachine } from "xstate";

const { pick } = R;

const vt = {
  START: "doing",
  CLOSE: "cancelling",
  MARK_FINISH: "finishing",
  QUIT: "quitting",
  MARK_BLOCKAGE: "blocking",
  BLOCK: "blocked",
  MARK_PAUSE: "pausing",
  PAUSE: "paused",
  RESUME: "doing",
  FINISH: "finished",
  CANCEL: "cancelled",
};

const initTaskMachine = (initial = "todo") =>
  createMachine({
    id: "task",
    initial,
    states: {
      todo: { on: { START: "inProgress", CLOSE: "failure" } },
      inProgress: {
        initial: "doing",
        on: { FINISH: "success", QUIT: "failure" },
        states: {
          doing: { on: { BLOCK: "blocked", PAUSE: "paused" } },
          paused: { on: { RESUME: "doing", BLOCK: "blocked" } },
          blocked: { on: { UNBLOCK: "doing" } },
        },
      },
      success: {
        initial: "finishing",
        states: {
          finishing: { on: { FINISH: "finished" } },
          finished: { type: "final" },
        },
      },
      failure: {
        initial: "cancelling",
        states: {
          cancelling: { on: { CANCEL: "cancelled" } },
          cancelled: { type: "final" },
        },
      },
    },
  });

export default initTaskMachine;
