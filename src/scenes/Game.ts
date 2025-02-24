import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        // todo
        // game start
        // Words faling
        // Level on the top right
        // Score under the level
        // City health under the level

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);
    }
}
