import React from 'react';
import { Calendar } from './calendar'
import { AddEvent } from "./addEvent";
import { Sidebar, Menu, } from 'semantic-ui-react'
import { compose, withState } from 'recompose'

const enhance = compose(
  withState('sidebarVisible', 'setSidebarVisible', false),
  withState('name', 'setName', ''),
  withState('invitesBy', 'setInvitesBy', ''),
  withState('startTime', 'setStartTime', ''),
  withState('endTime', 'setEndTime', ''),
  withState('color', 'setColor', '#f44336'),
);

export const Home = enhance((props) => {
  return (
    <div>
      <Calendar {...props}/>
      <Sidebar
        as={Menu}
        animation='overlay'
        direction='right'
        vertical
        visible={props.sidebarVisible}
        width={'wide'}
      >
        <AddEvent {...props}/>
      </Sidebar>
    </div>
  )
});
