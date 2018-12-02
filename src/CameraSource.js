import React, { Component } from "react";

export default class CameraSource extends Component {
  captureImage() {
    const context = this.canvas.getContext("2d");
    context.drawImage(this.videoStream, 0, 0, 800, 600);
    // const image = this.canvas.toDataURL("image/jpeg", 0.5);
    // return image;
  }

  render() {
      this.captureImage();
    return (
      <div>
        <video
          ref={stream => {
            this.videoStream = stream;
          }}
          width="800"
          height="600"
          style={{ display: "none" }}
        />
        <canvas
          ref={canvas => {
            this.canvas = canvas;
          }}
          width="800"
          height="600"
          style={{ width: 800, height: 600}}
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
