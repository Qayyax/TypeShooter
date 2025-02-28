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
    words: { text: Phaser.GameObjects.Text; word: string }[] = [];
    playerInput: string = "";

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

        // Spawn random words every set seconds
        // todo - delay should be dynamic based on level
        this.time.addEvent({
            delay: this.getSpawnDelay(),
            callback: this.spawnFallingWord,
            callbackScope: this,
            loop: true,
        });
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

    update(time: number, delta: number): void {
        // Todo
        // Check player's input
        // Every word on screen that has that input
        // letter should be highlighted in red
        // if spelling matches word, and that is the whole word
        // increase score
        // remove word
    }

    getSpawnDelay() {
        return Math.max(500, 3000 - this.level * 100);
    }

    handlePlayerInput(key: string) {
        if (key === "Backspace") {
            // Remove last character from input
            this.playerInput = this.playerInput.slice(0, -1);
        } else if (key.length === 1) {
            // Add typed character to input
            this.playerInput += key;
        }

        // Highlight matching words
        this.words.forEach(({ text, word }) => {
            if (word.startsWith(this.playerInput)) {
                // Highlight matched portion
                text.setText(
                    `[color=#00ff00]${this.playerInput}[/color]${word.slice(
                        this.playerInput.length,
                    )}`,
                );
            } else {
                // Reset to default color if not matched
                text.setText(word);
            }
        });

        // Check for exact match
        const matchIndex = this.words.findIndex(
            ({ word }) => word === this.playerInput,
        );
        if (matchIndex !== -1) {
            const matchedWord = this.words[matchIndex];
            matchedWord.text.destroy(); // Remove the word from the scene
            this.words.splice(matchIndex, 1); // Remove from the array
            this.playerInput = ""; // Reset the input
            this.score++; // Increment score
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    spawnFallingWord() {
        const word = generate() as string;
        const randomX = Phaser.Math.Between(0, this.scale.width - 100);
        const wordText = this.add.text(randomX, 53, word, {
            fontSize: "24px",
            color: "#ffffff",
        });

        this.physics.world.enable(wordText);

        const wordBody = wordText.body as Phaser.Physics.Arcade.Body;
        if (wordBody) {
            const baseSpeed = 20;
            const speedIncrement = 5;
            wordBody.setVelocityY(baseSpeed + speedIncrement * this.level);
            wordBody.setCollideWorldBounds(true);
        }
        this.words.push({ text: wordText, word: word });
    }

    reduceHealth() {
        if (this.cityHealth > 0) {
            this.cityHealth -= 5;
            this.cityText.setText(`City HP: ${this.cityHealth}`);
        }
    }
}
