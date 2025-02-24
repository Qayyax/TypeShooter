import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Text;
    title: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        this.logo = this.add
            .text(512, 300, "TypeShooter", {
                fontFamily: '"Press Start 2P", Arial, sans-serif',
                fontSize: "60px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.title = this.add
            .text(512, 400, "Start", {
                fontFamily: '"Press Start 2P", Arial, sans-serif',
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.changeScene());

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}
