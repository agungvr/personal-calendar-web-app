import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Home } from './containers/home';

const AppLayout = ({ component: Component, ...rest }) => {
  return (
    <Fragment>
      <main>
        <Component {...rest}/>
      </main>
    </Fragment>
  );
};

export default () => (
  <Router>
    <Switch>
      <AppLayout exact path="/" component={Home}/>
      <Redirect to="/"/>
    </Switch>
  </Router>
);
