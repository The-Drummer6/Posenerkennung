import React, { Component } from "react";
import Webcam from "./Webcam";
import "./App.css";

class App extends Component {

  render() {
    return (
      <div>
        <Webcam audio={false} width={600} height={600} />
      </div>
    );
  }
}

export default App;
