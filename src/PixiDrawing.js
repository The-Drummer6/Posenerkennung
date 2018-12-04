import * as React from 'react';
import * as Pixi from 'pixi.js';

export default class PixiDrawing extends React.Component {

    static CIRCLE_PATH = "../resources/circle-shape-outline.png";

    app = null;
    gameCanvas = null;

    constructor() {
        super();
    }

    setup() {
        let sprite = new Pixi.Sprite(
            Pixi.loader.resources[PixiDrawing.CIRCLE_PATH].texture
        );
        this.app.stage.addChild(sprite);
    }

    componentDidMount() {
        this.app = new Pixi.Application({
            width: 600,
            height: 600,
            antialias: true
        });
        this.gameCanvas.appendChild(this.app.view);
        this.app.start();

        Pixi.loader
            .add(PixiDrawing.CIRCLE_PATH)
            .load(() => { this.setup(); });
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
            <div ref={(thisDiv) => { component.gameCanvas = thisDiv }} />
        );
    }
}