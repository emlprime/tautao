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
  createMachine(
    {
      id: "task",
      initial,
      states: {
        todo: { on: { START: "inProgress", CLOSE: "failure" } },
        inProgress: {
          initial: "doing",
          on: { FINISH: "success", QUIT: "failure" },

          states: {
            doing: {
              activities: ["ticking"],
              on: { BLOCK: "blocked", PAUSE: "paused" },
              entry: ["notify"],
            },
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
    },
    {
      actions: {
        notify: (context, event) => {
          console.log("notified", context, event);
        },
      },
      activities: {
        ticking: () => {
          const interval = setInterval(() => console.log("BEEP!"), 1000);

          // Return a function that stops the beeping activity
          return () => clearInterval(interval);
        },
      },
    }
  );

export default initTaskMachine;
