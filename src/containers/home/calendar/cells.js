import dateFns from "date-fns";
import React from "react";
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react'
import { bindActionCreators } from "redux";
import { selectedDate, typeForm, selectedEvent } from "../../../reducers/calendar";
import moment from 'moment'

const enhance = compose(
  connect(
    state => ({
      event: state.calendar.events,
      type: state.calendar.type,
      selectedEvent: state.calendar.selectedEvent
    }),
    dispatch => (bindActionCreators({
      dispatchSelectedDate: (date) => selectedDate(date),
      dispatchTypeForm: (type) => typeForm(type),
      dispatchSelectedEvent: (data) => selectedEvent(data)
    }, dispatch))
  ),
  withHandlers({
    onDateClick: (props) => (days, agenda) => {

      if (!agenda || agenda.data.length < 3) {
        props.setSidebarVisible(true);
        props.dispatchSelectedDate(dateFns.format(days, 'YYYY-MM-DD'));
        props.dispatchTypeForm('add');
        props.dispatchSelectedEvent(null)
        props.setName('');
        props.setInvitesBy('');
        props.setStartTime('');
        props.setEndTime('');
        props.setColor('');

      }
    },
    onEventClick: (props) => (days, event) => (e) => {
      e.stopPropagation();

      const data = {
        date: dateFns.format(days, 'YYYY-MM-DD'),
        data: [event]
      };

      props.setSidebarVisible(true);
      props.dispatchSelectedDate(dateFns.format(days, 'YYYY-MM-DD'));
      props.dispatchTypeForm('edit');
      props.dispatchSelectedEvent(data)

      props.setName(event.name);
      props.setInvitesBy(event.invitesBy);
      props.setStartTime(moment(event.startTime));
      props.setEndTime(moment(event.endTime));
      props.setColor(event.color);
    }
  })
);

export const CalendarCells = enhance((props) => {
  const { currentMonth, selectedDate } = props;

  const monthStart = dateFns.startOfMonth(currentMonth);
  const monthEnd = dateFns.endOfMonth(monthStart);
  const startDate = dateFns.startOfWeek(monthStart);
  const endDate = dateFns.endOfWeek(monthEnd);

  const dateFormat = "D";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = dateFns.format(day, dateFormat);
      const cloneDay = day;

      let dayFormat = dateFns.format(day, 'YYYY-MM-DD');
      let agenda = props.event.find(x => x.date === dayFormat);
      days.push(
        <div
          onMouseDown={e => e.stopPropagation()}
          className={`col cell selected ${!dateFns.isSameMonth(day, monthStart)
            ? "disabled"
            : dateFns.isSameDay(day, selectedDate) ? "today" : ""
            }`}
          key={day}
          onClick={() => props.onDateClick(dateFns.parse(cloneDay), agenda)}
        >
          <span className="number">{formattedDate}</span>
          {
            agenda ?
              <div className="agenda-container">
                {
                  agenda.data.map((x, i) =>
                    <Popup trigger={
                      <a key={`index-${i}`} className="agenda-line" style={{ backgroundColor: x.color }}
                         onClick={props.onEventClick(dateFns.parse(cloneDay), x)}>
                        <div>
                          <span>{x.name}</span>
                        </div>
                      </a>
                    } flowing hoverable>
                      <div>
                        <div>
                          <span>
                            {x.name}
                          </span>
                        </div>
                        <div>
                          <span>
                            {dateFns.format(x.startTime, 'HH:mm')} - {dateFns.format(x.endTime, 'HH:mm')}
                          </span>
                        </div>
                        <div>
                          <span>
                            {x.invitesBy}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  )
                }
              </div>
              :
              <span className="bg">{formattedDate}</span>
          }
        </div>
      );
      day = dateFns.addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return <div className="body">{rows}</div>;
});
