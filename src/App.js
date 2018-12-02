import React, { Component } from "react";
import logo from "./logo.svg";
import CameraSource from "./CameraSource";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <CameraSource style={{width: "100%"}} />
        <p>Hallooooooooooooo</p>
      </div>
    );
  }
}

export default App;
