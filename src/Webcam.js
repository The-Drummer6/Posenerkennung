import React, { Component } from "react";
import PropTypes from "prop-types";
import * as posenet from "@tensorflow-models/posenet";
import {
  drawKeypoints
} from './utils';

function hasGetUserMedia() {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

const constrainStringType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.shape({
    exact: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  }),
  PropTypes.shape({
    ideal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  })
]);

const constrainLongType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    exact: PropTypes.number,
    ideal: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number
  })
]);

const constrainDoubleType = constrainLongType;

const videoConstraintType = PropTypes.shape({
  deviceId: constrainStringType,
  groupId: constrainStringType,
  aspectRatio: constrainDoubleType,
  facingMode: constrainStringType,
  frameRate: constrainDoubleType,
  height: constrainLongType,
  width: constrainLongType
});

export default class Webcam extends Component {
  static defaultProps = {
    className: "",
    height: 480,
    onUserMedia: () => { },
    onUserMediaError: () => { },
    screenshotFormat: "image/webp",
    width: 640,
    screenshotQuality: 0.92
  };

  static propTypes = {
    onUserMedia: PropTypes.func,
    onUserMediaError: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    screenshotFormat: PropTypes.oneOf([
      "image/webp",
      "image/png",
      "image/jpeg"
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
    screenshotQuality: PropTypes.number,
    screenshotWidth: PropTypes.number,
    videoConstraints: videoConstraintType
  };

  static mountedInstances = [];

  static userMediaRequested = false;

  referenceToVideoSet = false;

  net = null;

  constructor() {
    super();
    this.state = {
      hasUserMedia: false,
      modelLoaded: false
    };
  }

  componentWillMount() {
    posenet.load().then(net => {
      // posenet model loaded
      console.log("Model loaded");
      this.net = net;
      this.setState({ modelLoaded: true });
    });
  }

  componentDidMount() {
    if (!hasGetUserMedia()) return;

    Webcam.mountedInstances.push(this);

    if (!this.state.hasUserMedia && !Webcam.userMediaRequested) {
      this.requestUserMedia();
    }
  }

  componentWillUpdate(nextProps) {
    if (
      JSON.stringify(nextProps.videoConstraints) !==
      JSON.stringify(this.props.videoConstraints)
    ) {
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    const index = Webcam.mountedInstances.indexOf(this);
    Webcam.mountedInstances.splice(index, 1);

    Webcam.userMediaRequested = false;
    if (Webcam.mountedInstances.length === 0 && this.state.hasUserMedia) {
      if (this.stream.getVideoTracks) {
        this.stream.getVideoTracks().map(track => track.stop());
      } else {
        this.stream.stop();
      }
      window.URL.revokeObjectURL(this.state.src);
    }
  }

  getScreenshot() {
    if (!this.state.hasUserMedia) return null;

    const canvas = this.getCanvas();
    return (
      canvas &&
      canvas.toDataURL(
        this.props.screenshotFormat,
        this.props.screenshotQuality
      )
    );
  }

  getCanvas() {
    if (!this.state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      const canvas = document.createElement("canvas");
      const aspectRatio = this.video.videoWidth / this.video.videoHeight;

      const canvasWidth = this.props.screenshotWidth || this.video.clientWidth;

      canvas.width = canvasWidth;
      canvas.height = canvasWidth / aspectRatio;

      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    }

    const { ctx, canvas } = this;
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    return canvas;
  }

  requestUserMedia() {
    navigator.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    const sourceSelected = (videoConstraints) => {
      const constraints = {
        video: videoConstraints || true
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          Webcam.mountedInstances.forEach(instance =>
            instance.handleUserMedia(null, stream)
          );
        })
        .catch(e => {
          Webcam.mountedInstances.forEach(instance =>
            instance.handleUserMedia(e)
          );
        });
    };

    if ("mediaDevices" in navigator) {
      sourceSelected(this.props.videoConstraints);
    } else {
      const optionalSource = id => ({ optional: [{ sourceId: id }] });

      const constraintToSourceId = constraint => {
        const deviceId = (constraint || {}).deviceId;

        if (typeof deviceId === "string") {
          return deviceId;
        } else if (Array.isArray(deviceId) && deviceId.length > 0) {
          return deviceId[0];
        } else if (typeof deviceId === "object" && deviceId.ideal) {
          return deviceId.ideal;
        }

        return null;
      };

      MediaStreamTrack.getSources(sources => {
        let videoSource = null;

        sources.forEach(source => {
          if (source.kind === "video") {
            videoSource = source.id;
          }
        });

        const videoSourceId = constraintToSourceId(this.props.videoConstraints);
        if (videoSourceId) {
          videoSource = videoSourceId;
        }

        sourceSelected(
          optionalSource(videoSource)
        );
      });
    }

    Webcam.userMediaRequested = true;
  }

  handleUserMedia(err, stream) {
    if (err) {
      this.setState({ hasUserMedia: false });
      this.props.onUserMediaError(err);

      return;
    }

    this.stream = stream;

    try {
      this.video.srcObject = stream;
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream)
      });
    }

    this.props.onUserMedia();
  }

  sendFrameToNeuralNet() {
    setInterval(() => {
      this.net
        .estimateSinglePose(this.video, 0.5, false, 16)
        .then(pose => {
          console.log(pose.keypoints);
          let context = this.canvasRef.getContext("2d");
          drawKeypoints(pose.keypoints, 0.1, context, 1);
        });
    }, (1 / 1) * 1000);
  }

  render() {
    if (this.net) {
      console.log("Hier this.net");
      if (this.video) {
        console.log("Hier videoRef");
        this.sendFrameToNeuralNet();
      }
    }
    console.log("Render");
    return (
      <div>
        <video
          autoPlay
          width={this.props.width}
          height={this.props.height}
          src={this.state.src}
          muted={true}
          className={this.props.className}
          playsInline
          style={this.props.style}
          ref={ref => {
            //if (!this.referenceToVideoSet) {
            //this.referenceToVideoSet  = true;
            //} 
            this.video = ref;
          }}
        />
        <canvas
          ref={ref => { this.canvasRef = ref; }}
          width={600}
          height={600}>
        </canvas>
      </div>
    );
  }
}
