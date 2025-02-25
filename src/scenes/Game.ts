import { Scene } from "phaser";
import { generate } from "random-words";

// random words library
// https://www.npmjs.com/package/random-words

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    sky: Phaser.GameObjects.Graphics;
    cityHealth: number = 100;
    maxCityHealth: number = 100;
    score: number = 0;
    level: number = 0;
    scoreText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    cityText: Phaser.GameObjects.Text;
    floor: Phaser.GameObjects.Rectangle;

    constructor() {
        super("Game");
    }

    create() {
        // todo
        // Words faling

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1a1919);

        this.background = this.add.image(0, 0, "background").setOrigin(0.5, 0);
        this.background.setAlpha(0.3);

        // The top sky where the words fall from
        this.sky = this.add.graphics();
        this.sky.fillStyle(0x00000, 0.8);
        this.sky.fillRect(0, 0, 1024, 70);
        // this.sky.setDepth(50);

        // City health
        this.cityText = this.add.text(890, 22, `City HP: ${this.cityHealth}`);

        // Game level
        this.levelText = this.add.text(780, 22, `Level: ${this.level}`);

        // Player score
        this.scoreText = this.add.text(680, 22, `Score: ${this.score}`);

        // Ground
        this.floor = this.add.rectangle(512, 750, 1024, 40, 0x18451f);
        this.add.existing(this.floor);
        this.physics.add.existing(this.floor, true);

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnFallingWord,
            callbackScope: this,
            loop: true,
        });
    }

    spawnFallingWord() {
        const word = generate();
        console.log(word);
        const randomX = Phaser.Math.Between(0, this.scale.width - 100);
        const wordText = this.add.text(randomX, 50, word, {
            fontSize: "24px",
            color: "#ffffff",
        });

        this.physics.world.enable(wordText);
        const wordBody = wordText.body as Phaser.Physics.Arcade.Body;
        wordBody.setVelocityY(2);
        wordBody.setBounce(0.5);
        wordBody.setCollideWorldBounds(true);
        this.physics.add.collider(wordBody, this.floor, () => {
            // Start a timer to destroy the word after 3 seconds
            this.time.delayedCall(3000, () => {
                wordText.destroy();
            });

            // todo -
            // Change this to an individual function that reduces score if word still exist after 3000
        });
    }
}
