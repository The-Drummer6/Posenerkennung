import * as React from 'react';
import * as Pixi from 'pixi.js';
import myImage from './resources/circle-shape-outline.png';

export default class PixiDrawing extends React.Component {

    static CIRCLE = "circle-shape-outline";

    gameCanvas = null;
    pixi_cnt = null;

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
            .add(PixiDrawing.CIRCLE, myImage)
            .load(() => {
                console.log("setup");
                let sprite = new Pixi.Sprite(
                    Pixi.loader.resources[PixiDrawing.CIRCLE].texture
                );
                this.app.stage.addChild(sprite);
                sprite.visible = true;
            });
    }

    updatePixiCnt(element) {
        // the element is the DOM object that we will use as container to add pixi stage(canvas)
        this.pixi_cnt = element;
        //now we are adding the application to the DOM element which we got from the Ref.
        if(this.pixi_cnt && this.pixi_cnt.children.length<=0) {
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