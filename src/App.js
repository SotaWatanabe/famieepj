import React, { Component } from 'react';
import './App.css';
import {Content} from './content.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Content/>
      </div>
    );
  }
}

export default App;