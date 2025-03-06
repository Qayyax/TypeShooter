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

    // Add a restart game option
    const restartText = this.add
      .text(512, 480, "Restart Game", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    restartText.on("pointerover", () => {
      restartText.setStyle({ color: "#842929" });
    });

    restartText.on("pointerout", () => {
      restartText.setStyle({ color: "#ffffff" });
    });

    restartText.on("pointerdown", () => {
      this.scene.start("Game");
    });

    // Add a prompt for returning to the menu (below the score)
    const menuText = this.add
      .text(512, 540, "Return to Main Menu", {
        fontFamily: '"Press Start 2P"',
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    menuText.on("pointerover", () => {
      menuText.setStyle({ color: "#842929" });
    });

    menuText.on("pointerout", () => {
      menuText.setStyle({ color: "#ffffff" });
    });

    menuText.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    // Keyboard shortcuts
    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("Game");
    });

    this.input.keyboard?.once("keydown-ESCAPE", () => {
      this.scene.start("MainMenu");
    });
  }
}
