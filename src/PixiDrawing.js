import * as React from 'react';
import * as Pixi from 'pixi.js';
import circleImage from './resources/circle-shape-outline.png';
import barImage from './resources/bar.png';
import headImage from './resources/smile.png';

export default class PixiDrawing extends React.Component {

    static CIRCLE = "circle-shape-outline";
    static BAR = "bar";
    static HEAD = "smile";

    gameCanvas = null;
    pixi_cnt = null;

    stickmanShape = {
        headSprite: null,
        leftHandSprite: null,
        rightHandSprite: null,
        shoulderLine: null
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
            .add(PixiDrawing.BAR, barImage)
            .add(PixiDrawing.HEAD, headImage)
            .load(() => {
                console.log("setup");
                this.stickmanShape.leftHandSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.CIRCLE].texture);
                let barSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.BAR].texture);
                this.stickmanShape.headSprite = new Pixi.Sprite(Pixi.loader.resources[PixiDrawing.HEAD].texture);

                this.stickmanShape.leftHandSprite.scale.set(0.3, 0.3);
                barSprite.scale.set(0.3, 0.1);

                this.stickmanShape.shoulderLine = new Pixi.Graphics();
                this.stickmanShape.shoulderLine.lineStyle(20, 0x291dd1, 1);
                this.stickmanShape.shoulderLine.moveTo(0, 0);
                this.stickmanShape.shoulderLine.lineTo(0, 0);
                // this.stickmanShape.shoulderLine.x = 32;
                // this.stickmanShape.shoulderLine.y = 32;
                this.stickmanShape.shoulderLine.endFill();
                this.app.stage.addChild(this.stickmanShape.shoulderLine);

                this.app.stage.addChild(this.stickmanShape.headSprite);
                this.app.stage.addChild(this.stickmanShape.leftHandSprite);
                this.app.stage.addChild(barSprite);

                this.app.ticker.add(delta => { this.pixiLoop(delta) });
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
        console.log("UPDATTTEEEE");
        for (let i = 0; i < keypoints.length; i++) {
            if (i.part === "nose") {
                this.stickmanShape.headSprite.set(i.position.x, i.position.y);
            }
            else if (i.part === "leftShoulder") {
                this.stickmanShape.shoulderLine.moveTo(i.position.x, i.position.y);
            } else if (i.part === "rightShoulder") {
                this.stickmanShape.shoulderLine.lineTo(i.position.x, i.position.y);
            }
        }
    }

    pixiLoop() {
        this.stickmanShape.headSprite.position.x++;
        this.stickmanShape.headSprite.position.y++;
        this.stickmanShape.leftHandSprite.position.x++;
        this.stickmanShape.leftHandSprite.position.y++;
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