import React, { Component } from 'react';
import './App.css';
import {Content} from './content.js'
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Router>
          <Switch>
            <Route path="/:txHash" component={Content} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
