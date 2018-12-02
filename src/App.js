import React, { Component } from "react";
import logo from "./logo.svg";
import CameraSource from "./CameraSource";
import Webcam from "./Webcam";
import "./App.css";
import * as posenet from "@tensorflow-models/posenet";

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
        <Webcam audio={false} />
      </div>
    );
  }
}

export default App;
