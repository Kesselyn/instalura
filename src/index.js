import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import {Router, Route, browserHistory} from 'react-router';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import * as serviceWorker from './serviceWorker';

function verificaAutenticacao(nextState, replace) {
  if(localStorage.getItem('auth-token') === null) {
    replace('/?msg=Você precisa estar logado para acessar o endereço');
  }
}

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={Login}/>
      <Route path="/timeline" component={App} onEnter={verificaAutenticacao}/>
      <Route path="/logout" component={Logout}/>
    </Router>
  ), 
  document.getElementById('root')
);

serviceWorker.unregister();