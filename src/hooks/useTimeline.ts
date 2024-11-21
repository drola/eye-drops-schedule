import { Reducer, useEffect, useReducer } from 'react';
import { addHours, roundToNearestHours, startOfToday } from 'date-fns';
import { Prescription, prescriptions, prescriptionsToTimeline } from '@/utils/calculator';

interface State {
  nextItemIndex: number;
  startOfDay: string;
  endOfDay: string;
  items: { time: string; prescription: Prescription }[];
}

const createInitialState: (arg0?: State | null) => State = (arg0) =>
  arg0 ??
  withUpdatedTimeline({
    nextItemIndex: 0,
    startOfDay: addHours(startOfToday(), 6).toISOString(),
    endOfDay: addHours(startOfToday(), 22).toISOString(),
    items: [],
  });

function withUpdatedTimeline(state: State): State {
  return {
    ...state,
    items:
      state.startOfDay && state.endOfDay
        ? prescriptionsToTimeline(state.startOfDay, state.endOfDay, prescriptions)
        : [],
  };
}

type ResetAction = { type: 'reset' };
type GoToNextStepAction = { type: 'goToNextStep' };
type SetStartOfDayAction = { type: 'setStartOfDay'; value: Date | null };
type SetEndOfDayAction = { type: 'setEndOfDay'; value: Date | null };
type WakeupAction = { type: 'wakeup' };

type Action =
  | ResetAction
  | GoToNextStepAction
  | SetStartOfDayAction
  | SetEndOfDayAction
  | WakeupAction;

export function useTimeline() {
  const [state, dispatch] = useReducer<Reducer<State, Action>, State | null>(
    (state, action) => {
      switch (action.type) {
        case 'reset':
          return createInitialState();
        case 'goToNextStep':
          return { ...state, nextItemIndex: state.nextItemIndex + 1 };
        case 'setStartOfDay':
          return action.value
            ? withUpdatedTimeline({ ...state, startOfDay: action.value.toISOString() })
            : state;
        case 'setEndOfDay':
          return action.value
            ? withUpdatedTimeline({ ...state, endOfDay: action.value.toISOString() })
            : state;
        case 'wakeup':
          return withUpdatedTimeline({
            ...createInitialState(),
            startOfDay: roundToNearestHours(new Date(), { nearestTo: 1 }).toISOString(),
          });
        default:
          return state;
      }
    },
    JSON.parse(
      window.localStorage.getItem('eye-drops-timeline-v0') || 'null'
    ) as unknown as State | null,
    createInitialState
  );

  useEffect(() => {
    window.localStorage.setItem('eye-drops-timeline-v0', JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
