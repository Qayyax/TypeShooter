import { Scene } from "phaser";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a1919);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    // Retrieve the score from the registry
    const finalScore = this.registry.get("score") || 0;
    const finalLevel = this.registry.get("level") || 0;
    // Display "Game Over" text (centered at the top of the screen)
    this.gameover_text = this.add.text(512, 250, "Game Over", {
      fontFamily: '"Press Start 2P"',
      fontSize: "64px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.gameover_text.setOrigin(0.5);

    // Display the player's level (below "Game Over")
    this.add
      .text(512, 350, `Your Level: ${finalLevel}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Display the player's score (below the level text)
    this.add
      .text(512, 400, `Your Score: ${finalScore}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Add a prompt for restarting or returning to the menu (below the score)
    this.add
      .text(512, 500, "Click to return to Main Menu", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Preloader");
    });
    this.input.once("keydown-ENTER", () => {
      this.scene.start("Preloader");
    });
  }
}
