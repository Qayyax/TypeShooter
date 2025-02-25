import { Scene } from "phaser";

// random words library
// https://www.npmjs.com/package/random-words

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    sky: Phaser.GameObjects.Graphics;
    healthBar: Phaser.GameObjects.Graphics;
    cityHealth: number = 100;
    maxCityHealth: number = 100;
    healthBarWidth: number = 100;
    score: number = 0;
    level: number = 0;
    scoreText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    cityText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        // todo
        // game start
        // Words faling
        // Level on the top right
        // cityHealth under the level
        // City health under the level

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        // The top sky where the words fall from
        this.sky = this.add.graphics();
        this.sky.fillStyle(0x00000, 0.8);
        this.sky.fillRect(0, 0, 1024, 70);
        this.sky.setDepth(50);

        const barBackground = this.add.graphics();
        barBackground.fillStyle(0x444444, 1);
        // todo - add city health text in front
        barBackground.fillRoundedRect(900, 20, this.healthBarWidth, 20, 10);

        this.healthBar = this.add.graphics();
    }

    updateCityHealthBar() {
        // todo - update health bar when words fall on floor
        // this.cityHealthBar.clear();
    }
}
