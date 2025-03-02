import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    gameName: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        // todo
        // Add music maybe
        // Fadeaway animation for the speed
        this.background = this.add.image(512, 384, "background");

        this.gameName = this.add.text(300, 350, "TypeShooter", {
            fontFamily: '"Press Start 2P"',
            fontSize: 60,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
        });

        this.title = this.add
            .text(512, 460, "Play", {
                fontFamily: '"Press Start 2P"',
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive();

        this.title.on("pointerdown", () => {
            this.changeScene("Game");
        });

        this.input.keyboard!.on("keydown-ENTER", () => {
            this.changeScene("Game");
        });

        // Adding style on click
        this.title.on("pointerover", () => {
            this.title.setStyle({ color: "#842929" });
        });
        this.title.on("pointerout", () => {
            this.title.setStyle({ color: "#ffffff" });
        });
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}
