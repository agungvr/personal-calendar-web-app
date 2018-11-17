import React from "react";
import { compose, withState } from 'recompose';
import { CalendarHeader } from "./header";
import { CalendarDays } from "./days";
import { CalendarCells } from "./cells";

const enhance = compose(
  withState('currentMonth', 'setCurrentMonth', new Date()),
  withState('selectedDate', 'setSelectedDate', new Date())
);

export const Calendar = enhance((props) => {
  return (
    <div className="calendar">
      <CalendarHeader {...props} />
      <CalendarDays {...props} />
      <CalendarCells {...props} />
    </div>
  );
});
