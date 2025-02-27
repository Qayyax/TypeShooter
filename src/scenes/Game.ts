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
    wordGroup: Phaser.Physics.Arcade.Group;

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

        // Floor
        this.floor = this.add.rectangle(512, 750, 1024, 40, 0x18451f);
        this.add.existing(this.floor);
        this.physics.add.existing(this.floor, true);

        // Word group
        this.wordGroup = this.physics.add.group();
        this.physics.add.collider(this.wordGroup, this.wordGroup);

        // Spawn random words every set seconds
        // todo - delay should be dynamic based on level
        this.time.addEvent({
            delay: this.getSpawnDelay(),
            callback: this.spawnFallingWord,
            callbackScope: this,
            loop: true,
        });

        this.physics.add.collider(
            this.wordGroup,
            this.floor,
            (objA, objB) => this.handleCollision(objA, objB),
            undefined,
            this,
        );

        this.time.addEvent({
            delay: 100000, // Level up every
            callback: () => {
                this.level++;
                this.levelText.setText(`Level: ${this.level}`);
            },
            callbackScope: this,
            loop: true,
        });
    }

    getSpawnDelay() {
        return Math.max(500, 3000 - this.level * 100);
    }

    spawnFallingWord() {
        const word = generate();
        const randomX = Phaser.Math.Between(0, this.scale.width - 100);
        const wordText = this.add.text(randomX, 50, word, {
            fontSize: "24px",
            color: "#ffffff",
        });

        this.physics.world.enable(wordText);
        this.wordGroup.add(wordText);

        const wordBody = wordText.body as Phaser.Physics.Arcade.Body;
        if (wordBody) {
            wordBody.setVelocityY(200);
            wordBody.setBounce(0.2);
            wordBody.setCollideWorldBounds(true);
        }
    }

    handleCollision(
        objectA: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Group,
        objectB: Phaser.GameObjects.Group | Phaser.GameObjects.Rectangle,
    ) {
        // ObjectA is rectanlge
        // ObjectB is text
        // console.log("ObjectA:", objectA.type);
        // console.log("ObjectB:", objectB.type);
        // if (objectA.type === "Text") {
        //     console.log("ObjectA is text");
        // } else if (objectB.type === "Rectangle") {
        //     console.log("ObjectB is rectangle");
        // }

        if (objectB.type === "Text") {
            this.time.delayedCall(3000, () => {
                objectB.destroy();
                this.reduceHealth();
            });
        }
    }

    reduceHealth() {
        if (this.cityHealth > 0) {
            this.cityHealth -= 5;
            // this.cityText.setText(`City HP: ${this.cityHealth}`);
        }
    }
}
