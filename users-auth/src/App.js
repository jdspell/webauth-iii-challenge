import React, { Component } from 'react';
import './App.css';

import { Route, NavLink } from 'react-router-dom';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path='/' component={Login} />
      </div>
    );
  }
}

export default App;
