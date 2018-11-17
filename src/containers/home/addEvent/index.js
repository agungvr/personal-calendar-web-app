import React, { Fragment } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react'
import { compose, withState, withHandlers } from 'recompose'
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import dateFns from 'date-fns'
import { CirclePicker } from 'react-color';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { eventCalendar } from '../../../reducers/calendar/'

const enhance = compose(
  connect(
    state => ({
      selectedDate: state.calendar.selectedDate,
      selectedEvent: state.calendar.selectedEvent,
      event: state.calendar.events,
      type: state.calendar.type
    }),
    dispatch => (bindActionCreators({
      dispatchNewEvent: (data) => eventCalendar(data)
    }, dispatch))
  ),
  withState('withBlocking', 'setWithBlocking', false),
  withHandlers({
    onCloseSidebar: (props) => () => props.setSidebarVisible(false),
    onDeleteClick: (props) => () => {
      let event = props.event;
      let agenda = event.find(x => x.date === props.selectedEvent.date);
      let data = agenda.data.filter(x => x !== props.selectedEvent.data[0]);
      agenda.data = data;
      const newEvent = event.filter(x => {
        if (x.date === agenda.date) {
          x.data = agenda.data
        }
        return x
      });
      if (props.type === 'add') {

      }
      if (agenda.data.length === 0) {
        const newEvent = event.filter(x => x.date !== agenda.date);
        props.dispatchNewEvent(newEvent)
      } else {
        props.setSidebarVisible(false);
        props.dispatchNewEvent(newEvent)
      }
    },
    onEditClick: (props) => () => {
      const { name, invitesBy, startTime, endTime, color } = props;
      let event = props.event;
      let agenda = event.find(x => {
        if (x.date === props.selectedEvent.date) {
          let data = x.data.map(z => {
            if(z.id === props.selectedEvent.data[0].id){
              z = {
                id: props.selectedEvent.data[0].id,
                name, invitesBy, startTime, endTime, color
              };
              return z
            }
            return z
          });
          x.data = data;
          return x
        }
      });

      props.setSidebarVisible(false);
      props.dispatchNewEvent([...props.event, agenda])
    },
    onSubmitClick: (props) => () => {
      const { name, invitesBy, startTime, endTime, color } = props;

      if ((name && invitesBy && startTime && endTime && color) !== '') {

        let agenda = props.event.find(x => x.date === props.selectedDate);

        let now = new Date();

        const data = {
          id: now.getTime(),
          name,
          invitesBy,
          startTime,
          endTime,
          color
        };

        if (agenda) {
          agenda.data.push(data);
        } else {
          const newEvent = {
            date: props.selectedDate,
            data: [data]
          };
          props.dispatchNewEvent([...props.event, newEvent])
        }

        props.setSidebarVisible(false)
      } else {
        alert('Please fill in all fields.')
      }
    }
  })
);

export const AddEvent = enhance((props) => {
  return (
    <div className={`event-container ${props.type === 'add' ? 'bg-sidebar-add' : 'bg-sidebar-edit'}`}>
      <div className="event-title-container">
        <div>
          <h2 className="event-title">
            {props.type === 'add' ? 'Add' : 'Edit'} Event
          </h2>
          <span className="date-event-title">
            {dateFns.format(props.selectedDate, 'DD MMMM YYYY')}
          </span>
        </div>
        <Icon onClick={props.onCloseSidebar} name='close' className="event-close"/>
      </div>
      <div className="m-t-em">
        <Form>
          <Form.Field>
            <label>Name</label>
            <input
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
              placeholder='event name'/>
          </Form.Field>
          <Form.Field>
            <label>Invites Email</label>
            <input
              value={props.invitesBy}
              onChange={(e) => props.setInvitesBy(e.target.value)}
              placeholder='xxx@example.com'/>
          </Form.Field>
          <Form.Field>
            <label>Start Time</label>
            <TimePicker
              value={props.startTime}
              placeholder='08:00'
              onChange={(value) => props.setStartTime(value)}
              showSecond={false} minuteStep={15}/>
          </Form.Field>
          <Form.Field>
            <label>End Time</label>
            <TimePicker
              value={props.endTime}
              placeholder='10:00'
              onChange={(value) => props.setEndTime(value)}
              showSecond={false} minuteStep={15}/>
          </Form.Field>
          <Form.Field>
            <label>Color</label>
            <CirclePicker
              color={props.color}
              onChangeComplete={(color) => props.setColor(color.hex)}
            />
          </Form.Field>
          {
            props.type === 'add' ?
              <Button
                onClick={props.onSubmitClick}
                type='submit'>
                Save
              </Button>
              :
              <Fragment>
                <Button
                  onClick={props.onEditClick}
                  type='submit'>
                  Edit
                </Button>
                <Button
                  onClick={props.onDeleteClick}
                  type='submit'>
                  Delete
                </Button>
              </Fragment>
          }
        </Form>
      </div>
    </div>
  )
});
