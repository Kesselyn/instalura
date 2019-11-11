import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import {Router, Route, browserHistory} from 'react-router';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={Login}/>
      <Route path="/timeline" component={App}/>
    </Router>
  ), 
  document.getElementById('root')
);

serviceWorker.unregister();