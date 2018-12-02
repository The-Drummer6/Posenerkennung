import React, { Component } from "react";
import logo from "./logo.svg";
import CameraSource from "./CameraSource";
import Webcam from "./Webcam";
import "./App.css";
import * as posenet from "@tensorflow-models/posenet";

class App extends Component {
  net = null;
  videoRef = null;

  constructor() {
    super();
    this.state = {
      modelLoaded: false,
      refLoaded: false
    };
  }

  refGetter(ref) {
    this.videoRef = ref;
    this.SetState({ refLoaded: true });
  }

  componentWillMount() {
    posenet.load().then(net => {
      // posenet model loaded
      console.log("Model loaded");
      this.SetState({ modelLoaded: true });
      this.net = net;
    });
  }

  render() {
    if (this.net) {
      console.log("Hier this.net");
      if (this.videoRef) {
        console.log("Hier videoRef");
        this.net
          .estimateSinglePose(this.videoRef, 0.5, false, 16)
          .then(pose => {
            console.log(pose);
          });
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <Webcam audio={false} senselessFunction={this.refGetter.bind(this)} />
      </div>
    );
  }
}

export default App;
