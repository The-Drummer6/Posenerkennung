import React, { Component } from "react";

export default class CameraSource extends Component {
  
  componentDidMount() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
    } else {
      console.error("Kacke, Funktion nicht verfügbar in dem Browser");
    }
  }

  handleVideo(stream) {
    // Update the state, triggering the component to re-render with the correct stream
    this.setState({ videoSrc: window.URL.createObjectURL(stream) });
  }
  
  // captureImage() {
  //   if (this.canvas !== undefined) {
  //     context = this.canvas.getContext("2d");
  //     context.drawImage(this.videoStream, 0, 0, 800, 600);
  //   }
  //   // const image = this.canvas.toDataURL("image/jpeg", 0.5);
  //   // return image;
  // }

  render() {
    // this.captureImage();
    return (
      <div>
        <video
          src={this.state.videoSrc} 
          autoPlay="true"
          width="800"
          height="600"
        />
        <canvas
          width="800"
          height="600"
          style={{ width: 800, height: 600 }}
        />
      </div>
    );
  }
}

/**
 * captureImage() {    
  const context = this.canvas.getContext("2d")
  context.drawImage(this.videoStream, 0, 0, 800, 600)
  const image = this.canvas.toDataURL('image/jpeg', 0.5)
  return image
}
render() {
  return (
   <div>
    <video 
      ref={(stream) => { this.videoStream = stream }}
      width='800'
      height='600'
      style={{display: 'none'}}>
    </video>
    <canvas
      ref={(canvas) => { this.canvas = canvas }}
      width='800'
      height='600'
      style={{display: 'none'}}
    </canvas>
  </div>
 )
}
 */

/**
var MyComponent = React.createClass({
    getInitialState: function(){
      return { videoSrc: null }
    },
    componentDidMount: function(){
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
      if (navigator.getUserMedia) {
          navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
      }
    },
    handleVideo: function(stream) {
      // Update the state, triggering the component to re-render with the correct stream
      this.setState({ videoSrc: window.URL.createObjectURL(stream) });
    },
    videoError: function() {
  
    },
    render: function() {
      return <div>
        <video src={this.state.videoSrc} autoPlay="true" />
      </div>;
      }
  });
*/
