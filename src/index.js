import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);

serviceWorker.unregister();
