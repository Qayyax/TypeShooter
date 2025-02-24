import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    city: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    // Todo:
    // Create random words falling
    // Score counter
    // Levels to determine how fast words would fall
    // Correct input to destroy words
    // if input is correct destroy words, increase score
    // City health bar
    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#000000");

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);
        this.city = this.add.image(0, 660, "city");
        this.city.setScale(2);
        this.city.setAlpha(0.5);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
