import * as R from "ramda";
import { createMachine } from "xstate";

const taskMachine = createMachine(
  {
    id: "task",
    initial: "todo",
    states: {
      todo: { on: { START: "inProgress", CLOSE: "failure" } },
      inProgress: {
        id: "inProgress",
        initial: "doing",
        on: { FINISH: "success", QUIT: "failure" },

        states: {
          doing: {
            activities: ["ticking"],
            on: { BLOCK: "blocked", PAUSE: "paused" },
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
    actions: {},
    activities: {
      ticking: () => {
        const interval = setInterval(() => console.log("BEEP!"), 1000);

        // Return a function that stops the beeping activity
        return () => clearInterval(interval);
      },
    },
  }
);

export default taskMachine;
