import { Scene } from "phaser";
import { generate } from "random-words";

// random words library
// https://www.npmjs.com/package/random-words

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    sky: Phaser.GameObjects.Graphics;
    cityHealth: number = 100;
    score: number = 0;
    level: number = 0;
    scoreText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    cityText: Phaser.GameObjects.Text;
    floor: Phaser.GameObjects.Rectangle;
    words: { text: Phaser.GameObjects.Text; word: string }[] = [];
    playerInput: string = "";
    playerInputOn: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        // todo
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#1a1919");

        this.background = this.add.image(0, 0, "background").setOrigin(0.5, 0);
        this.background.setAlpha(0.3);

        // The top sky where the words fall from
        this.sky = this.add.graphics();
        this.sky.fillStyle(0, 0.8);
        this.sky.fillRect(0, 0, 1024, 70);
        // this.sky.setDepth(50);

        // City health
        this.cityText = this.add.text(890, 22, `City HP: ${this.cityHealth}`);

        // Game level
        this.levelText = this.add.text(780, 22, `Level: ${this.level}`);

        // Player score
        this.scoreText = this.add.text(680, 22, `Score: ${this.score}`);

        // Floor
        this.floor = this.add.rectangle(512, 750, 1024, 40, 0x1b1818);
        this.add.existing(this.floor);
        this.physics.add.existing(this.floor, true);

        // Player input on screen
        this.playerInputOn = this.add.text(400, 730, this.playerInput, {
            fontSize: "40px",
            color: "#ffffff",
        });
        this.playerInputOn.setDepth(100);

        this.time.addEvent({
            delay: Phaser.Math.Between(500, 1000),
            callback: this.spawnFallingWord,
            callbackScope: this,
            loop: true,
        });
        this.time.addEvent({
            delay: 30_000, // Level up every 30 seconds
            callback: () => {
                this.level++;
                this.levelText.setText(`Level: ${this.level}`);
            },
            callbackScope: this,
            loop: true,
        });

        this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            this.handlePlayerInput(event);
        });
    }

    update() {
        this.words.forEach(({ text }, index) => {
            const wordBody = text.body as Phaser.Physics.Arcade.Body;

            if (wordBody && wordBody.y >= this.floor.y - 10) {
                text.destroy();
                this.words.splice(index, 1); // Remove from the array
                this.reduceHealth();
            }
        });
        this.playerInputOn.setText(this.playerInput);
        if (this.cityHealth <= 0) {
            // Save the score to the registry
            this.registry.set("score", this.score);
            this.registry.set("level", this.level);
            // working on Gameover scene
            this.scene.start("GameOver");
            this.resetGame();
        }
    }

    handlePlayerInput(event: KeyboardEvent) {
        if ((event.ctrlKey || event.metaKey) && event.key === "Backspace") {
            this.playerInput = "";
        }
        if (event.key === "Backspace") {
            // Remove last character from input
            this.playerInput = this.playerInput.slice(0, -1);
        } else if (event.key === "Enter") {
            this.playerInput = "";
        } else if (event.key.length === 1) {
            // Add typed character to input
            this.playerInput += event.key;
            this.playerInput = this.playerInput.trim();
        }

        // if (this.playerInput === "") return;

        //  Gradient color
        this.words.forEach(({ text, word }) => {
            if (word.startsWith(this.playerInput)) {
                const matchedPart = this.playerInput;

                // Set a gradient for the matched portion
                const gradient = text.context.createLinearGradient(0, 0, text.width, 0);
                gradient.addColorStop(0, "#35ED1C");
                gradient.addColorStop(matchedPart.length / word.length, "#35ED1C");
                gradient.addColorStop(matchedPart.length / word.length, "#ffffff");
                gradient.addColorStop(1, "#ffffff");

                // Apply the gradient and set the text
                text.setText(word);
                text.setFill(gradient);
            } else {
                // Reset to default style
                text.setText(word).setFill("#ffffff");
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
            // Reset the input
            this.playerInput = "";
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    spawnFallingWord() {
        // todo
        // Future update
        // Select type of words - uppercase, title case with numbers
        const word = generate() as string;
        const randomX = Phaser.Math.Between(0, this.scale.width - 100);
        const wordText = this.add.text(randomX, 53, word, {
            fontSize: "24px",
            color: "#ffffff",
        });

        this.physics.world.enable(wordText);

        const wordBody = wordText.body as Phaser.Physics.Arcade.Body;
        if (wordBody) {
            const baseSpeed = 50;
            const speedIncrement = 20;
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

    resetGame() {
        this.cityHealth = 100;
        this.cityText.setText(`City HP: ${this.cityHealth}`);
        this.level = 0;
        this.levelText.setText(`Level: ${this.level}`);
        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}
