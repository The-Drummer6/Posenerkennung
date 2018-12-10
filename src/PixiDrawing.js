import * as React from 'react';
import * as Pixi from 'pixi.js';

import circleImage from './resources/circle-shape-outline.png';
import headImage from './resources/smile.png';
import footImage from './resources/sneaker.png';
import footImage2 from './resources/sneaker2.png';

export default class PixiDrawing extends React.Component {

    static CIRCLE = "circle-shape-outline";
    static BAR = "bar";
    static HEAD = "smile";
    static FOOT = "sneaker";
    static FOOT2 = "sneaker2";

    gameCanvas = null;
    pixi_cnt = null;

    stickmanShape = {
        headSprite: null,
        leftHandSprite: null,
        rightHandSprite: null,
        leftFootSprite: null,
        rightFootSprite: null,
        drawingLayer: null
    }

    constructor() {
        super();
        this.app = new Pixi.Application({
            width: 600,
            height: 600,
            antialias: true,
            transparent: false
        });
    }

    setup() {
        Pixi.loader
            .add(PixiDrawing.CIRCLE, circleImage)
            .add(PixiDrawing.HEAD, headImage)
            .add(PixiDrawing.FOOT, footImage)
            .add(PixiDrawing.FOOT2, footImage2)
            .load(() => {
                console.log("setup");
                this.stickmanShape.leftHandSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.CIRCLE].texture);
                this.stickmanShape.rightHandSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.CIRCLE].texture);
                this.stickmanShape.headSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.HEAD].texture);
                this.stickmanShape.leftFootSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.FOOT2].texture);
                this.stickmanShape.rightFootSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.FOOT].texture);

                this.stickmanShape.leftHandSprite.scale.set(0.3, 0.3);
                this.stickmanShape.rightHandSprite.scale.set(0.3, 0.3);
                this.stickmanShape.leftFootSprite.scale.set(0.6, 0.6);
                this.stickmanShape.rightFootSprite.scale.set(0.6, 0.6);

                this.stickmanShape.drawingLayer = new Pixi.Graphics();
                this.stickmanShape.drawingLayer.lineStyle(20, 0x291dd1, 1);
                this.stickmanShape.drawingLayer.endFill();
                this.app.stage.addChild(this.stickmanShape.drawingLayer);

                this.app.stage.addChild(this.stickmanShape.headSprite);
                this.app.stage.addChild(this.stickmanShape.leftHandSprite);
                this.app.stage.addChild(this.stickmanShape.rightHandSprite);
                this.app.stage.addChild(this.stickmanShape.leftFootSprite);
                //this.app.stage.addChild(this.stickmanShape.rightFootSprite);
            });
    }

    updatePixiCnt(element) {
        // the element is the DOM object that we will use as container to add pixi stage(canvas)
        this.pixi_cnt = element;
        //now we are adding the application to the DOM element which we got from the Ref.
        if (this.pixi_cnt && this.pixi_cnt.children.length <= 0) {
            this.pixi_cnt.appendChild(this.app.view);
            //The setup function is a custom function that we created to add the sprites. We will this below
            this.setup();
        }
    };

    componentDidMount() {
        this.app.start();
    }

    /**
     * Stop the Application when unmounting.
     */
    componentWillUnmount() {
        this.app.stop();
    }

    updateStickmanPosition(keypoints) {
        this.stickmanShape.drawingLayer.clear();
        this.stickmanShape.drawingLayer.lineStyle(15, 0x291dd1, 1);
        let bodypartsAsDict = {};
        for (let i = 0; i < keypoints.length; i++) {
            let bodypart = keypoints[i];
            bodypartsAsDict[bodypart.part] = {
                x: bodypart.position.x,
                y: bodypart.position.y,
                score: bodypart.score
            }
        }
        console.log(bodypartsAsDict);

        // Kopf, Hand und Fuß
        this.stickmanShape.headSprite.position.x = bodypartsAsDict.nose.x - 30;
        this.stickmanShape.headSprite.position.y = bodypartsAsDict.nose.y - 30;

        this.stickmanShape.leftHandSprite.position.x = bodypartsAsDict.leftWrist.x;
        this.stickmanShape.leftHandSprite.position.y = bodypartsAsDict.leftWrist.y;
        this.stickmanShape.rightHandSprite.position.x = bodypartsAsDict.rightWrist.x;
        this.stickmanShape.rightHandSprite.position.y = bodypartsAsDict.rightWrist.y;

        this.stickmanShape.leftFootSprite.position.x = bodypartsAsDict.leftAnkle.x;
        this.stickmanShape.leftFootSprite.position.y = bodypartsAsDict.leftAnkle.y;
        this.stickmanShape.rightFootSprite.position.x = bodypartsAsDict.rightAnkle.x;
        this.stickmanShape.rightFootSprite.position.y = bodypartsAsDict.rightAnkle.y;

        this.stickmanShape.drawingLayer.moveTo(bodypartsAsDict.leftWrist.x, bodypartsAsDict.leftWrist.y);
        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.leftElbow.x, bodypartsAsDict.leftElbow.y);

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.leftShoulder.x, bodypartsAsDict.leftShoulder.y);

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.rightShoulder.x, bodypartsAsDict.rightShoulder.y);

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.rightElbow.x, bodypartsAsDict.rightElbow.y);

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.rightWrist.x, bodypartsAsDict.rightWrist.y);

        this.stickmanShape.drawingLayer.moveTo((bodypartsAsDict.leftShoulder.x + bodypartsAsDict.rightShoulder.x)/2, 
            (bodypartsAsDict.leftShoulder.y + bodypartsAsDict.rightShoulder.y)/2);

        let pointOfOriginLowerBody = {
            x: (bodypartsAsDict.leftHip.x + bodypartsAsDict.rightHip.x)/2,
            y: (bodypartsAsDict.leftHip.y + bodypartsAsDict.rightHip.y)/2
        }
        this.stickmanShape.drawingLayer.lineTo(pointOfOriginLowerBody.x, pointOfOriginLowerBody.y)

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.leftKnee.x, bodypartsAsDict.leftKnee.y);
        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.leftAnkle.x, bodypartsAsDict.leftAnkle.y);

        this.stickmanShape.drawingLayer.moveTo(pointOfOriginLowerBody.x, pointOfOriginLowerBody.y);

        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.rightKnee.x, bodypartsAsDict.rightKnee.y);
        this.stickmanShape.drawingLayer.lineTo(bodypartsAsDict.rightAnkle.x, bodypartsAsDict.rightAnkle.y);

        this.stickmanShape.drawingLayer.endFill();
        this.app.render();
    }

    /**
     * Simply render the div that will contain the Pixi Renderer.
     */
    render() {
        let component = this;
        return (
            <div ref={this.updatePixiCnt.bind(this)} />
        );
    }
}