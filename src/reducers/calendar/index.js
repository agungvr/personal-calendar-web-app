import { handleActions } from 'redux-actions';
import { createAction } from 'redux-actions';

export const eventCalendar = createAction('EVENT_CALENDAR');
export const selectedDate = createAction('SELECTED_DATE');
export const typeForm = createAction('TYPE_FORM');
export const selectedEvent = createAction('SELECTED_EVENT');

const initialState = {
  type: 'add',
  selectedDate: null,
  selectedEvent: null,
  events: []
};

export default handleActions(
  {
    [selectedEvent]: (state, actions) => {
      return { ...state, selectedEvent: actions.payload }
    },
    [typeForm]: (state, actions) => {
      return { ...state, type: actions.payload }
    },
    [selectedDate]: (state, actions) => {
      return { ...state, selectedDate: actions.payload }
    },
    [eventCalendar]: (state, actions) => {
      return { ...state, events: actions.payload }
    }
  },
  { ...initialState }
);
